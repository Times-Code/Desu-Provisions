import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Search } from 'lucide-react'
import SubmissionModal from "@/app/dataupdate/Modal";
import HomePageForm from "@/app/customer/submissionform";
import SearchBar from "./searchBar";
import ProductList from "./productList";
import AddGroceryList from "./AddGrocerryList";
import RecentTransactions from "@/app/recenttransactions/page";
import GroceryDataTable from "@/app/groceryData/page";


const ShuffleHero = () => {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("");
  const [timeData, setTimeData] = useState({
    time: "",
    date: "",
    day: "",
  });

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const now = new Date();
      const hours = now.getHours();
      let currentGreeting;

      if (hours < 12) {
        currentGreeting = "Good Morning";
      } else if (hours < 18) {
        currentGreeting = "Good Afternoon";
      } else {
        currentGreeting = "Good Evening";
      }

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const date = now.toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const day = now.toLocaleDateString([], { weekday: "long" });

      setGreeting(currentGreeting);
      setTimeData({ time, date, day });
    };

    updateGreetingAndTime();
    const interval = setInterval(updateGreetingAndTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative px-8 md:px-10 w-full h-[100%]">
      <div className="flex justify-end gap-2 mb-2 items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
        <span><span className="text-gray-800">{`${timeData.time}`}</span> &bull; {`${timeData.day}`}, {`${timeData.date}`}</span>
      </div>
      <div className=" min-h-[500px] h-[100%] flex flex-col justify-between">
        <section className="w-full">
          <div >

            <div className="relative w-full">
              <SearchBar />
            </div>


          </div>
        </section>

        <div className="fixed bottom-[80px] left-0 w-full px-8 md:px-10 z-[100] pointer-events-none">
          <div className="max-w-[1400px] mx-auto pointer-events-auto bg-white p-6 rounded-t-2xl border-t border-x border-rose-200 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.2)] transform-none">
            <div className="flex flex-wrap gap-8 justify-around items-center">
              <AddGroceryList />
              <GroceryDataTable />
              <HomePageForm />
              <SubmissionModal />
              <RecentTransactions />
              <button className="bg-slate-700 hover:bg-slate-800 text-white py-2 px-6 rounded-md font-semibold shadow-sm transition-all active:scale-95">
                Inventory Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ShuffleHero;
