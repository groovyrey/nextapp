import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { UserProvider } from "./context/UserContext";

import Navbar from "./components/Navbar";
import BootstrapClient from "./BootstrapClient";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luloy",
  description: "Luloy App",
  icons: {
    icon: '/luloy.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </UserProvider>
        <BootstrapClient />
        <Toaster />
      </body>
    </html>
  );
}