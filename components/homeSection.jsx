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
    const interval = setInterval(updateGreetingAndTime, 1000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
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
          {/* <span className="block mb-4 text-sm md:text-xl text-gray-800 font-medium">
            {greeting}
            <span className=" text-rose-800 text-2xl md:text-5xl capitalize">
              {" "}
              {session?.user?.name}
            </span>
          </span> */}
          <div className="relative w-full">
            {/* <input
              type="text" 
              placeholder="Search for grocery items..." 
              className="w-full py-3 pl-4 pr-12 border-none bg-transparent  text-gray-800"
            /> */}
            {/* <button className="absolute right-0 top-0 bottom-0 px-6 rounded-r-full hover:bg-rose-300">
            </button> */}
            <SearchBar />
            </div>


        </div>

        {/* <button>Register</button> */}
       
        {/* <ShuffleGrid /> */}
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

// const shuffle = (array) => {
//   let currentIndex = array.length,
//     randomIndex;

//   while (currentIndex != 0) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex],
//       array[currentIndex],
//     ];
//   }

//   return array;
// };

// const squareData = [
//   {
//     id: 1,
//     src: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
//   },
//   {
//     id: 2,
//     src: "https://images.unsplash.com/photo-1510925758641-869d353cecc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
//   },
//   {
//     id: 3,
//     src: "https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
//   },
//   {
//     id: 4,
//     src: "https://images.unsplash.com/photo-1580238053495-b9720401fd45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
//   },
//   {
//     id: 5,
//     src: "https://images.unsplash.com/photo-1569074187119-c87815b476da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1325&q=80",
//   },
//   {
//     id: 6,
//     src: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
//   },
//   {
//     id: 7,
//     src: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
//   },
//   {
//     id: 8,
//     src: "https://plus.unsplash.com/premium_photo-1671436824833-91c0741e89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
//   },
//   {
//     id: 9,
//     src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
//   },
//   {
//     id: 10,
//     src: "https://images.unsplash.com/photo-1610768764270-790fbec18178?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
//   },
//   {
//     id: 11,
//     src: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=684&q=80",
//   },
//   {
//     id: 12,
//     src: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=882&q=80",
//   },
//   {
//     id: 13,
//     src: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
//   },
//   {
//     id: 14,
//     src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
//   },
//   {
//     id: 15,
//     src: "https://images.unsplash.com/photo-1606244864456-8bee63fce472?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=681&q=80",
//   },
//   {
//     id: 16,
//     src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1820&q=80",
//   },
// ];

// const generateSquares = () => {
//   return shuffle(squareData).map((sq) => (
//     <motion.div
//       key={sq.id}
//       layout
//       transition={{ duration: 1.5, type: "spring" }}
//       className="w-full h-full"
//       style={{
//         backgroundImage: `url(${sq.src})`,
//         backgroundSize: "cover",
//       }}
//     ></motion.div>
//   ));
// };

// const ShuffleGrid = () => {
//   const timeoutRef = useRef(null);
//   const [squares, setSquares] = useState(generateSquares());

//   useEffect(() => {
//     shuffleSquares();

//     return () => clearTimeout(timeoutRef.current);
//   }, []);

//   const shuffleSquares = () => {
//     setSquares(generateSquares());

//     timeoutRef.current = setTimeout(shuffleSquares, 3000);
//   };

//   return (
//     <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
//       {squares.map((sq) => sq)}
//     </div>
//   );
// };

export default ShuffleHero;
