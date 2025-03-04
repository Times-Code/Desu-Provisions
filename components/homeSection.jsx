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
      <div className="flex justify-between flex-wrap gap-4 mb-10 items-start">
        <p className="text-sm md:text-base text-gray-700">
          It&apos;s <span className="text-rose-500">{`${timeData.time}`}</span>
        </p>
        <p className="text-sm md:text-base text-gray-700">
          Date: <span className="text-rose-500">{`${timeData.date}`}</span>
        </p>
        <p className="text-sm md:text-base text-gray-700">
          Day: <span className="text-rose-500">{`${timeData.day}`}</span>
        </p>
      </div>
      <div className=" min-h-[500px] h-[100%] flex flex-col justify-between">
      <section className="w-full">
        <div >

          <div className="relative w-full">
            <SearchBar />
            </div>


        </div>
      </section>

      <div className=" flex flex-end items-end flex-wrap gap-10 justify-around">
      <AddGroceryList />
      <GroceryDataTable />
      <HomePageForm />
      <SubmissionModal />
      <RecentTransactions />
      {/* <TranslateButton /> */}
      </div>
      </div>
    </main>
  );
};
export default ShuffleHero;
