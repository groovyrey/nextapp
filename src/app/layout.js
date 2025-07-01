import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Msgrey",
  description: "A messaging app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}