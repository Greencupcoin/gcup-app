import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "../components/WalletProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GCUP Golf Tournament",
  description: "Select your team and earn GCUP tokens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a1a] text-white min-h-screen`}>
        <WalletContextProvider>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster position="top-center" />
        </WalletContextProvider>
      </body>
    </html>
  );
}
