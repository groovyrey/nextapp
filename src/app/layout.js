import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/Navbar";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mensahe para kay rey",
  description: "App ni reymart",
};

export default function RootLayout({ children }) {
  const mainRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gsap.to(mainRef.current, { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
        gsap.to(mainRef.current, { opacity: 1, y: 0, duration: 0.3 });
      } });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Navbar />
          <main ref={mainRef} className="container py-5">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}