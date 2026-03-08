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
  const [showActionsMenu, setShowActionsMenu] = useState(false);

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

        {/* Admin Actions Dropdown Container */}
        <div className="fixed bottom-6 left-6 z-[150]">
          <div className="relative">
            {showActionsMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setShowActionsMenu(false)}
                ></div>
                <div className="absolute bottom-full left-0 mb-3 z-50 bg-white border border-gray-200 rounded-xl shadow-[0_-5px_25px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 font-black text-gray-500 uppercase tracking-widest text-xs flex justify-between items-center">
                    Dashboard Hub
                  </div>
                  <div className="flex flex-col p-1.5 space-y-0.5 [&_button]:!bg-transparent [&_button]:!text-gray-700 [&_button]:w-full [&_button]:text-left [&_button]:px-4 [&_button]:py-3 [&_button]:!shadow-none [&_button]:hover:!bg-rose-50 [&_button]:hover:!text-[#e42529] [&_button]:transition-all [&_button]:font-bold [&_button]:text-sm [&_button]:rounded-lg">
                    <AddGroceryList />
                    <GroceryDataTable />
                    <HomePageForm />
                    <SubmissionModal />
                    <RecentTransactions />
                    <button>
                      Inventory Summary
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="py-3.5 px-6 bg-slate-800 text-white rounded-full font-black hover:bg-slate-900 transition-all shadow-[0_5px_15px_rgba(15,23,42,0.3)] active:scale-95 text-sm uppercase tracking-wide flex justify-center items-center gap-3"
            >
              <span>Admin Actions</span>
              <svg className={`w-4 h-4 transition-transform ${showActionsMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ShuffleHero;
