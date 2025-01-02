"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ShuffleHero from "./homeSection";
import Image from "next/image";
import logo1 from "../public/logo1.jpg"
import Footer from "@/app/footer/page";

export default function UserInfo() {
  const { data: session } = useSession();

  useEffect(() => {
    const handleLogoutOnClose = async (event) => {
      // Call signOut when the window is being closed
      await signOut();
    };

    window.addEventListener("beforeunload", handleLogoutOnClose);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleLogoutOnClose);
    };
  }, []);

  return (
    <div>
      <header className="border-b rounded-2xl border-rose-400 mb-2">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <nav
          aria-label="Global"
          className="mx-auto flex items-center justify-between p-3 lg:px-8"
        >
          <div>
          <Image src={logo1} alt="Logo" className="rounded-xl w-[60px] sm:w-[65px] md:w-[70px] lg:w-[80px] " />

          </div>
          {/* <TranslateButton /> */}
          <h1 className="font-bold text-2xl hidden sm:block text-rose-600 uppercase">Desu Provisions</h1>
          <button
            onClick={() => signOut()}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded font-bold px-6 py-2 "
          >
            Log Out
          </button>
        </nav>
      </header>
      <ShuffleHero />
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}
