// const { ERC20 } = require("@/app/abis/abi");

import { getAccount } from "@wagmi/core";
import { config } from "../../src/app/Web3Config";

// const { erc20Abi } = require("viem");
const ethers = require("ethers");
// import { BrowserProvider, formatEther, parseUnits, Contract } from "ethers";

const AURA_TOKEN_CONTRACT_ADDRESS =
  "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF";
const TEST_ADDR_1 = "0x9648868B8FE455dcc59Bd2be2F51BBcCa87A414C";
const TEST_ADDR_2 = "0x87fC1313880d579039aC48dB8B25428ed5F33C4a";

// https://etherscan.io/address/0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF#:~:text=Aura%3A%20AURA%20Token%20%7C%20Address%200xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF%20%7C%20Etherscan
// function useAuraContractApprove(params) {
//     const { } = useReadContract({
//         address: AURA_TOKEN_CONTRACT_ADDRESS,
//         abi: erc20Abi,
//         functionName: "approve",
//         args: []
//     });
// }

// ERC-20 ABI (only including the balanceOf function)
const tokenAbi = ["function balanceOf(address owner) view returns (uint256)"];

export async function getAuraTokenBalance(address_) {
  if (typeof window !== "undefined") {
    const { address } = getAccount(config);

    console.log(address);
    if (address === undefined) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const provider = new BrowserProvider(window.ethereum);

    try {
      const tokenContract = new ethers.Contract(
        AURA_TOKEN_CONTRACT_ADDRESS,
        tokenAbi,
        provider
      );

      // const balance = await tokenContract.balanceOf(TEST_ADDR_2);
      const balance = await tokenContract.balanceOf(address);

      const formattedBalance = parseFloat(
        ethers.utils.formatEther(balance)
      ).toFixed(2);

      // console.log(`Balance: ${formattedBalance} tokens`);

      return formattedBalance;
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return undefined;
    }
  }
}

export function shortenAddress(address, startLength = 6, endLength = 10) {
  if (!address) return "";

  // Ensure the address is long enough
  if (address.length <= startLength + endLength) {
    return address; // Return the original address if it's too short
  }

  const start = address.slice(0, startLength); // Take the first `startLength` characters
  const end = address.slice(-endLength); // Take the last `endLength` characters

  return `${start}....${end}`; // Join with dots in between
}

export function shortenAddressSmall(address, startLength = 4, endLength = 4) {
  if (!address) return "";

  // Ensure the address is long enough
  if (address.length <= startLength + endLength) {
    return address; // Return the original address if it's too short
  }

  const start = address.slice(0, startLength); // Take the first `startLength` characters
  const end = address.slice(-endLength); // Take the last `endLength` characters

  return `${start}....${end}`; // Join with dots in between
}

// getAuraTokenBalance();
