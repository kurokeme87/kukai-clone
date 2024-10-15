import localFont from "next/font/local";
import "./globals.css";
import Layout from "./internalLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Kukai Wallet",
  description:
    "A Secure Home for your digital assets. Seamlessly connect with experiences and apps on Tezos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f8f9fa] antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
