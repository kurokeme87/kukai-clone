// import Layout from "@/components/layout";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="container w-full mx-auto px-4 sm:px-6  md:px-[30px] py-12">
        <div className="lg:flex lg:items-start lg:justify-between lg:mt-[70px] w-full">
          <div className="lg:w-1/2 h-full">
            <h1 className="text-4xl font-[520] lg:text-left text-center text-gray-900 sm:text-5xl md:text-[42px]">
              A Secure Home <br /> for your Digital Assets
            </h1>
            <p className="mt-3  lg:text-left text-center lg:mx-auto text-lg text-gray-500 sm:text-xl md:mt-8 md:max-w-3xl">
              Manage your digital assets and seamlessly <br /> connect with
              experiences and apps on Tezos.
            </p>

            <div className="lg:hidden flex items-center justify-center  pt-[50px]">
              <div className="text-center">
                <p className="text-gray-700 text-lg ">Sign in with social:</p>
                <div className="flex flex-col items-center gap-3 mt-5">
                  <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-full">
                    <img src="/kukai/google-logo.svg" className="w-5" />
                    <p className="text-gray-700 text-sm font-semibold">
                      Continue with google
                    </p>
                  </div>

                  <div className="flex ">
                    <div className="flex items-center gap-4 p-2 bg-white rounded-full">
                      <img src="/kukai/facebook-logo.svg" className="w-9" />
                    </div>
                    <div className="flex items-center gap-4 p-2 bg-white rounded-full">
                      <img src="/kukai/twitter-logo.svg" className="w-9" />
                    </div>
                    <div className="flex items-center gap-4 p-2 bg-white rounded-full">
                      <img src="/kukai/reddit-logo.svg" className="w-9" />
                    </div>
                    <div className="flex items-center gap-4 p-2 bg-white rounded-full">
                      <img src="/kukai/email-logo-start.svg" className="w-9" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700 text-lg ">Get Kukai app:</p>
                  <div className="flex mt-5">
                    <div className="flex items-center justify-center gap-1 py-3 px-10 bg-white rounded-2xl">
                      <img
                        src="/kukai/download-app-store-light.svg"
                        className="w-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <Link
                href="/create-wallet"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Create New Wallet
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                href="/import-wallet"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
              >
                Import Wallet
              </Link>
            </div>
          </div> */}
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2 flex lg:justify-end justify-center">
            <img
              src="/kukai/landing-hero.png"
              alt="Digital Assets Illustration"
              className="lg:w-[70%]  w-[70%] h-auto"
            />
          </div>
        </div>
      </div>
      <div className="lg:mt-[-250px] md:mt-[-300px] mt-[-200px] bg-gradient-to-b h-[50vh] from-[#dbe2e7] to-[#f6f7f9]">
        <div className="bg-[#d6dbe3] p-2"></div>
        <div className="lg:block hidden px-[180px] pt-[50px]">
          <p className="text-gray-700 text-lg ">Sign in with social:</p>
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-full">
              <img src="/kukai/google-logo.svg" className="w-5" />
              <p className="text-gray-700 text-sm font-semibold">
                Continue with google
              </p>
            </div>
            <div className="flex items-center gap-4 p-2 bg-white rounded-full">
              <img src="/kukai/facebook-logo.svg" className="w-9" />
            </div>
            <div className="flex items-center gap-4 p-2 bg-white rounded-full">
              <img src="/kukai/twitter-logo.svg" className="w-9" />
            </div>
            <div className="flex items-center gap-4 p-2 bg-white rounded-full">
              <img src="/kukai/reddit-logo.svg" className="w-9" />
            </div>
            <div className="flex items-center gap-4 p-2 bg-white rounded-full">
              <img src="/kukai/email-logo-start.svg" className="w-9" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-700 text-lg ">Get Kukai app:</p>
            <div className="flex mt-5">
              <div className="flex items-center justify-center gap-1 py-3 px-10 bg-white rounded-2xl">
                <img
                  src="/kukai/download-app-store-light.svg"
                  className="w-[120px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
