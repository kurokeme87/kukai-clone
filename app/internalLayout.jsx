"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation instead
import { useState } from "react";
import { FaTelegramPlane, FaGithub, FaTwitter, FaBars } from "react-icons/fa";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-[100vh] flex flex-col ">
      <header className="relative z-50">
        <div
          className={`${
            isOpen && "bg-white"
          } mx-auto z-50 px-4 sm:px-6 lg:px-[88px] py-4 flex justify-between items-center`}
        >
          <Link href="/" className="flex items-center">
            <img
              src="/kukai/header-logo.svg"
              alt="Kukai Logo"
              className="h-[50px] w-[150px] mr-2"
            />
          </Link>

          <nav className="lg:block hidden">
            <ul className="flex space-x-4">
              {/* Show all links on the homepage */}
              {pathname === "/" && (
                <>
                  <li>
                    <Link
                      href="/import-wallet"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/import-wallet"
                          ? "text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Import Wallet
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create-wallet"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/create-wallet"
                          ? "text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Create New Wallet
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/connect-ledger"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/connect-ledger"
                          ? "text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Connect Ledger
                    </Link>
                  </li>
                </>
              )}

              {/* Show only the current active link on individual pages */}
              {pathname !== "/" && pathname === "/import-wallet" && (
                <li>
                  <Link
                    href="/import-wallet"
                    className="text-blue-600 text-sm font-semibold"
                  >
                    Import Wallet
                  </Link>
                </li>
              )}

              {pathname !== "/" && pathname === "/create-wallet" && (
                <li>
                  <Link
                    href="/create-wallet"
                    className="text-blue-600 text-sm font-semibold"
                  >
                    Create New Wallet
                  </Link>
                </li>
              )}

              {pathname !== "/" && pathname === "/connect-ledger" && (
                <li>
                  <Link
                    href="/connect-ledger"
                    className="text-blue-600 text-sm font-semibold"
                  >
                    Connect Ledger
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div
            onClick={toggleDropdown}
            className="lg:hidden block p-2 rounded-full border border-gray-500"
          >
            <FaBars className="text-gray-500" />
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute w-full top-[70px] mt-2  bg-white border border-gray-300  shadow-lg z-50">
            <div className="px-2 py-4 border-b border-gray-200">
              <a
                href="/import-wallet"
                className="block text-gray-700 text-[11px] hover:text-blue-600"
              >
                Import Wallet
              </a>
            </div>
            <div className="px-2 py-4 border-b border-gray-200">
              <a
                href="/create-wallet"
                className="block text-gray-700 text-[11px] hover:text-blue-600"
              >
                Create Wallet
              </a>
            </div>
            <div className="px-2 py-4">
              <a
                href="/connect-ledger"
                className="block text-gray-700 text-[11px] hover:text-blue-600"
              >
                Connect Ledger
              </a>
            </div>
          </div>
        )}
      </header>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleDropdown} // Closes the dropdown when clicking the overlay
        ></div>
      )}
      <main className="">{children}</main>
      <footer className={`${pathname !== "/" && "bg-white"} py-4  w-full`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
          <div className="flex  space-x-4 text-[8px]">
            <a href="#" className=" text-black hover:text-gray-500">
              Terms of Use
            </a>
            <a href="#" className=" text-black hover:text-gray-500">
              Privacy
            </a>
            <a
              href="#"
              className=" text-black md:block hidden hover:text-gray-500"
            >
              Contact
            </a>
          </div>
          <div>
            <p className="text-[8px]">FOLLOW KUKKAI ON</p>
            <div className="flex gap-2 mt-1 items-center justify-center">
              <FaGithub className="text-md text-gray-500" />
              <FaTelegramPlane className="text-md text-gray-500" />
              <FaTwitter className="text-md text-gray-500" />
            </div>
            <p className="text-center mt-1 text-[8px]">since 2018</p>
          </div>
          <div className="flex space-x-4 text-[8px]">
            <a
              href="#"
              className=" text-black md:hidden block hover:text-gray-500"
            >
              Contact
            </a>
            <a href="#" className=" text-black hover:text-gray-500">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
