"use client";

import { ChevronLeft } from "lucide-react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const secretPhrase = Array.from({ length: 20 }, (_, i) => `word${i + 1}`);

export default function ConnectLedger() {
  const [step, setStep] = useState(0);
  const [revealedPhrase, setRevealedPhrase] = useState(false);
  const [verificationWord, setVerificationWord] = useState("");
  const [input, setInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (step === 3) {
      setWalletAddress(`tz1${Math.random().toString(36).substring(2, 15)}`);
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1 && verificationWord !== secretPhrase[2]) {
      alert("Incorrect verification word");
      return;
    }
    if (
      step === 2 &&
      (password !== confirmPassword || !isStrongPassword(password))
    ) {
      alert("Passwords do not match or are not strong enough");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pwd
    );
  };

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className=" bg-[#f0f2f4] flex flex-col items-center px-4 justify-center pb-[52px]">
      <div className="max-w-[800px] relative  mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a className="absolute  left-0" href="/">
          <div className="flex items-center justify-center gap-1 py-1 md:px-5 px-1 bg-white rounded-xl border border-gray-300">
            <ChevronLeft size={11} className="text-[11px] " />
            <p className="text-[11px] md:block hidden">Back</p>
          </div>
        </a>
        <div className="w-full mx-auto">
          <div className="">
            <h2 className="text-2xl text-center font-bold mb-12">
              Connect your Ledger
            </h2>
            <p className="mb-8 text-center text-[11px]">
              Keep the private keys safely on your Ledger device and use Kukai
              to access the Tezos blockchain.
            </p>
            <p className="mb-4 text-center text-[11px]">
              You need to open the Tezos Wallet app on your Ledger device.
            </p>

            <div className="flex flex-col  items-center justify-center">
              <div className="w-[54%] rounded-full border  bg-white focus-within:border-blue-600">
                {isToggled ? (
                  <input
                    className="p-3 w-full bg-transparent text-[11px] text-center focus:outline-none"
                    type="text"
                    placeholder="44'/1729'/0'/0'"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                ) : (
                  <p className="text-green-600 text-[11px] p-3 text-center">
                    Account Discovery (recommended)
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center py-4 gap-5">
              <p className="mr-3 text-gray-600 text-[11px]">
                Custom derivation path:
              </p>

              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">
                  {isToggled ? "ON" : "OFF"}
                </p>

                <div className="flex items-center justify-center ">
                  <button
                    onClick={toggleSwitch}
                    className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
                      isToggled ? "bg-white" : "bg-white"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full  ${
                        isToggled ? "bg-[#505bf0]" : "bg-gray-200"
                      } transition-transform duration-300 ${
                        isToggled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className={` flex justify-center mt-4`}>
              <button
                className="w-[55%] bg-[#505bf0] text-white rounded-full py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleNext}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
