"use client";

import { ChevronLeft } from "lucide-react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const secretPhrase = Array.from({ length: 20 }, (_, i) => `word${i + 1}`);

export default function CreateWallet() {
  const [step, setStep] = useState(0);
  const [revealedPhrase, setRevealedPhrase] = useState(false);
  const [verificationWord, setVerificationWord] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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


  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="w-full mx-auto">
            <div className="">
              <h2 className="text-2xl font-bold text-center mb-8">
                Back up your seed
              </h2>
              <p className="mb-4 text-[10px] text-center">
                WHEN YOU CREATE A NEW WALLET, NEW TEZOS RECOVERY (SEED) WORDS
                ARE GENERATED.
                <br /> YOUR SEED WORDS ARE THE MASTER KEY OF YOUR WALLET
                ACCOUNTS AND ANY VALUE THEY HOLD.
              </p>
              <div
                className="bg-gray-100 shadow-2xl w-full rounded-2xl p-4 mb-12 h-[140px] flex items-center justify-center cursor-pointer relative"
                onClick={() => setRevealedPhrase(!revealedPhrase)}
                onMouseLeave={() =>
                  setRevealedPhrase(revealedPhrase === true && false)
                }
              >
                {revealedPhrase ? (
                  <div className="grid grid-cols-7 gap-2">
                    {secretPhrase.map((word, index) => (
                      <span key={index} className="text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm font-semibold z-10 text-[#5963ff]">
                    CLICK HERE TO REVEAL YOUR SEED WORDS
                  </div>
                )}
                {!revealedPhrase && (
                  <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur" />
                )}
              </div>
              <p className="text-red-500 text-[14px] font-semibold mb-4">
                BE SURE SURE TO BACK IT UP (SEED WORDS), WRITE IT DOWN, AND KEEP
                IT INCREDIBLY SAFE.
              </p>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleNext}
                  className="w-[45%] bg-[#505bf0] text-white rounded-full py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex justify-center pb-12 mx-auto">
            <div className="lg:w-[800px] md:w-[500px] ">
              <h2 className="text-2xl text-center font-bold mb-12">
                Verify your seed
              </h2>
              <p className="mb-4 text-center text-[11px]">
                FILL IN THE 3RD WORD TO VERIFY YOUR SEED BACKUP
              </p>
              <div className="p-1 w-full rounded-full bg-[#c1cdd5]"></div>

              <div className="flex items-center justify-between mt-12">
                <div className="text-center">
                  <p className="text-[11px] mb-2">Word 2</p>
                  <p className="text-[11px] font-semibold">head</p>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                  <p className="text-[11px] mb-2 text-center">Word 2</p>

                  <div className="border-[3px] md:w-full w-[70%] rounded-full focus-within:border-[#5963ff] border-gray-300">
                    <form onSubmit={handleNext} action="">
                      <input
                        className="p-2 bg-transparent w-full  text-center focus:outline-none"
                        // placeholder="Enter the 3rd word"
                        value={verificationWord}
                        onChange={(e) => setVerificationWord(e.target.value)}
                      />
                    </form>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[11px] mb-2">Word 2</p>
                  <p className="text-[11px] font-semibold">head</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full mx-auto">
            <div className="">
              <h2 className="text-2xl text-center font-bold mb-12">
                Set a password
              </h2>
              <p className="mb-8 text-center text-[11px]">
                THIS PASSWORD WILL BE USED TO CREATE AN ENCRYPTED KEYSTORE FILE.
              </p>
              <p className="mb-4 text-center text-[11px]">
                WHEN PERFORMING OPERATIONS THAT NEED TO BE SIGNED WITH YOUR
                SECRET KEY, THIS PASSWORD WILL BE REQUIRED
              </p>

              <div className="flex flex-col  items-center justify-center">
                <div className="w-[45%] rounded-full border  bg-white focus-within:border-blue-600">
                  <input
                    className="p-3 w-full bg-transparent text-[11px] text-center focus:outline-none"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="my-4 text-[11px]">Password strength -</div>
                <div className="w-[45%] rounded-full border  bg-white focus-within:border-blue-600">
                  <input
                    className="p-3 w-full bg-transparent text-[11px] text-center focus:outline-none"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div
                className={`${password === "" && "hidden"
                  } flex justify-center mt-4`}
              >
                <button
                  className="w-[45%] bg-[#505bf0] text-white rounded-full py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleNext}
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full pb-12  mx-auto">
            <div className="">
              <h2 className="text-2xl text-center font-bold mb-12">
                Wallet created!
              </h2>
              <p className="mb-8 text-center text-[11px]">
                YOUR WALLET IS NOW SET UP AND READY TO BE USED.
              </p>
              <p className="mb-4 text-center text-[11px]">
                DOWNLOAD YOUR ENCRYPTED KEYSTORE FILE AND IMPORT IT WHEN YOU
                WANT TO ACCESS YOUR WALLET.
              </p>

              <div className="flex justify-center">
                <div className="bg-white shadow-lg rounded-2xl w-[45%] px-6 py-6 mb-4 text-center">
                  <p className="text-[11px]">Your public account address:</p>
                  <p className="text-[11px]">
                    tz1QobeqZyJn1LEjxnCh64FsHq7QKFFejv9s
                  </p>
                </div>
              </div>
              <div
                className={`${password === "" && "hidden"
                  } flex justify-center mt-4`}
              >
                <button className="w-[54%] text-[11px] bg-[#505bf0] text-white rounded-full py-3 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  DOWNLOAD
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className=" bg-[#f0f2f4] flex flex-col items-center px-4 justify-center ">
      <div className="max-w-[800px] relative  mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a className="absolute  left-0" href="/">
          <div className="flex items-center justify-center gap-1 py-1 md:px-5 px-1 bg-white rounded-xl border border-gray-300">
            <ChevronLeft size={11} className="text-[11px] " />
            <p className="text-[11px] md:block hidden">Back</p>
          </div>
        </a>
        {renderStep()}
      </div>
      <div className="my-8 flex items-center space-x-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={` rounded-full ${i === step ? "bg-[#505bf0] w-3 h-3" : "bg-gray-300 w-2 h-2"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
