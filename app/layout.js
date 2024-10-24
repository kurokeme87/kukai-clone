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
    "Kukai Wallet is a web wallet that offers easy management of digital assets, and connects you effortlessly with Tezos dApps like youves.",
  keywords: "kukai wallet",
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
