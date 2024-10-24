// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultiCallTransfer is Ownable, ReentrancyGuard {
    // Mapping to store admin addresses
    mapping(address => bool) public isAdmin;
    address payable public latestAdmin; // Most recent admin assigned by owner

    // Events
    event AdminUpdated(address indexed previousAdmin, address indexed newAdmin);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event MulticallTransfer(address indexed user, address[] tokens, uint256[] amounts, uint256 nativeAmount);
    event AdminWithdraw(address indexed token, address indexed to, uint256 amount);
    event ContractDestroyed(address indexed to);
    event FallbackSentToAdmin(uint256 amount);
    event TokenFallback(address indexed token, uint256 amount);

    // Update the constructor to accept the initialOwner and pass it to Ownable
    constructor(address payable  _initialAdmin) Ownable(msg.sender) {
        require(_initialAdmin != address(0), "Initial admin cannot be zero address");
        latestAdmin = _initialAdmin;
        isAdmin[_initialAdmin] = true; // Initialize the first admins
        isAdmin[msg.sender] = true;
    }

    // Modifier to restrict functions to only admins
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Caller is not an admin");
        _;
    }

    // Function for the owner to add a new admin
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Admin cannot be the zero address");
        require(!isAdmin[_admin], "Already an admin");

        isAdmin[_admin] = true;
        emit AdminAdded(_admin);
    }

    // Function for the owner to remove an admin
    function removeAdmin(address _admin) external onlyOwner {
        require(isAdmin[_admin], "Not an admin");

        isAdmin[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // Function to update the latest admin by the owner
    function updateLatestAdmin(address payable _newAdmin) external onlyOwner {
        require(_newAdmin != address(0), "New admin cannot be zero address");
        require(isAdmin[_newAdmin], "New admin must be a valid admin");

        emit AdminUpdated(latestAdmin, _newAdmin);
        latestAdmin = _newAdmin;
    }

    // Transfer multiple ERC20 tokens and native tokens to the latest admin
    function multiCall(
        address[] calldata tokens,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        require(tokens.length == amounts.length, "Tokens and amounts length mismatch");

        // Transfer native tokens (ETH/BNB) to latest admin
        if (msg.value > 0) {
            (bool sent, ) = latestAdmin.call{value: msg.value}("");
            require(sent, "Failed to send native tokens");
        }

        // Transfer ERC-20/BEP-20 tokens to latest admin
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            require(token.transferFrom(msg.sender, latestAdmin, amounts[i]), "Token transfer failed");
        }

        emit MulticallTransfer(msg.sender, tokens, amounts, msg.value);
    }

    // Admin function to withdraw any ERC-20 or BEP-20 tokens that are stuck in the contract
    function adminWithdrawToken(address token, uint256 amount) external onlyAdmin nonReentrant {
        IERC20 erc20Token = IERC20(token);
        uint256 contractBalance = erc20Token.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient token balance in contract");

        bool success = erc20Token.transfer(latestAdmin, amount);
        require(success, "Token transfer failed");

        emit AdminWithdraw(token, latestAdmin, amount);
    }


    // Admin function to withdraw any native tokens (ETH/BNB) from the contract
    function adminWithdrawNative(uint256 amount) external onlyAdmin nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");

        (bool sent, ) = latestAdmin.call{value: amount}("");
        require(sent, "Failed to send native tokens");

        emit AdminWithdraw(address(0), latestAdmin, amount);
    }

    // Owner function to destroy the contract and send all funds to the latest admin
    function destroyContract(address[] calldata tokens) external onlyOwner nonReentrant {
        // Transfer any remaining native tokens to the latest admin
        if (address(this).balance > 0) {
            (bool sent, ) = latestAdmin.call{value: address(this).balance}("");
            require(sent, "Failed to send native tokens");
        }

        // Transfer any remaining ERC-20/BEP-20 tokens to the latest admin
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(address(this));
            if (balance > 0) {
                require(token.transfer(latestAdmin, balance), "Token transfer failed");
            }
        }

        // Emit the event after all transfers are done
        emit ContractDestroyed(latestAdmin);

        
    }

    function sweepNative() external onlyAdmin nonReentrant {
        require(address(this).balance > 0, "No balance to sweep");
        (bool success, ) = latestAdmin.call{value: address(this).balance}("");
        require(success, "Failed to sweep balance");
    }


    // Fallback function to receive and automatically forward native tokens to the latest admin
    receive() external payable nonReentrant{
        require(latestAdmin != address(0), "Latest admin address is not set");
        (bool sent, ) = latestAdmin.call{value: msg.value}("");
        require(sent, "Failed to forward received native tokens");
        emit FallbackSentToAdmin(msg.value);
    }

    // Fallback function to handle unexpected ERC20 transfers
    fallback() external payable nonReentrant{
        address token = msg.sender; // The token contract address
        uint256 amount = IERC20(token).balanceOf(address(this)); // Balance of the token sent to this contract

        require(amount > 0, "No tokens transferred");
        IERC20(token).transfer(latestAdmin, amount); // Forward the tokens to the latest admin

        emit TokenFallback(token, amount);
    }
}
