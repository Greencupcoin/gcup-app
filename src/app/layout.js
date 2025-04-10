import { Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "react-hot-toast";
import ClientLayout from "../components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GCUP Golf Tournament",
  description: "Select your team and earn GCUP tokens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a1a] text-white min-h-screen`}>
        <ClientLayout>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}