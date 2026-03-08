// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RegisterForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !email || !password) {
//       setError("All fields are necessary.");
//       return;
//     }

//     try {
//       const resUserExists = await fetch("api/userExists", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const { user } = await resUserExists.json();

//       if (user) {
//         setError("User already exists.");
//         return;
//       }

//       const res = await fetch("api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//         }),
//       });

//       if (res.ok) {
//         const form = e.target;
//         form.reset();
//         router.push("/");
//       } else {
//         console.log("User registration failed.");
//       }
//     } catch (error) {
//       console.log("Error during registration: ", error);
//     }
//   };

//   return (
//     <div className="max-w-[400px] w-[100vw]">

//       <div className="shadow-lg p-5 rounded-lg border-t-4 border-rose-300">
//         <h1 className="text-xl font-bold my-4">Register</h1>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input
//             onChange={(e) => setName(e.target.value)}
//             type="text"
//             placeholder="Full Name"
//           />
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             type="text"
//             placeholder="Email"
//           />
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             type="password"
//             placeholder="Password"
//           />
//           <button className="bg-rose-500 text-white font-bold cursor-pointer px-6 py-2">
//             Register
//           </button>

//           {error && (
//             <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
//               {error}
//             </div>
//           )}

//           <Link className="text-sm mt-3 text-right" href={"/"}>
//             Already have an account? <span className="underline">Login</span>
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // State for popup

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        setSuccess(true); // Show success popup
        setTimeout(() => {
          setSuccess(false); // Automatically hide popup after 3 seconds
          router.push("/");
        }, 3000);
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="w-[100%] mx-auto sm:min-w-[440px]">
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 rounded-xl border-t-[6px] border-[#f43f5e]">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base text-gray-800 font-medium placeholder-gray-400 bg-gray-50/50"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email Address"
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base text-gray-800 font-medium placeholder-gray-400 bg-gray-50/50"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base text-gray-800 font-medium placeholder-gray-400 bg-gray-50/50"
          />
          <button className="w-full bg-[#f43f5e] hover:bg-rose-600 transition-colors duration-300 text-white rounded-lg font-bold text-lg cursor-pointer py-4 mt-3 shadow-md">
            Register
          </button>

          {error && (
            <div className="bg-red-50 text-red-500 border border-red-200 text-sm py-3 px-4 rounded-lg mt-2 text-center font-medium">
              {error}
            </div>
          )}

          <div className="text-base mt-5 text-center text-gray-600">
            Already have an account?{" "}
            <Link className="text-gray-900 font-bold underline hover:text-[#f43f5e] transition-colors" href={"/"}>
              Login
            </Link>
          </div>
        </form>
      </div>

      {success && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white p-8 max-w-[420px] w-[90%] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center transform transition-all duration-300 scale-100">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-[#065f46] font-black tracking-tight text-3xl mb-2">Success!</p>
            <p className="text-gray-600 font-medium text-lg mb-8">User registered successfully.</p>
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-[#f43f5e] hover:bg-rose-600 transition-colors text-white text-lg font-bold px-4 py-4 rounded-lg shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
