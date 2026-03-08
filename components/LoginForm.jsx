"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[100%] mx-auto sm:min-w-[440px]">
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 rounded-xl border-t-[6px] border-[#f43f5e]">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Username or Email"
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base text-gray-800 font-medium placeholder-gray-400 bg-gray-50/50"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base text-gray-800 font-medium placeholder-gray-400 bg-gray-50/50"
          />
          <button className="w-full bg-[#f43f5e] hover:bg-rose-600 transition-colors duration-300 text-white rounded-lg font-bold text-lg cursor-pointer py-4 mt-3 shadow-md">
            Login
          </button>

          {error && (
            <div className="bg-red-50 text-red-500 border border-red-200 text-sm py-3 px-4 rounded-lg mt-2 text-center font-medium">
              {error}
            </div>
          )}

          <div className="text-base mt-5 text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link className="text-gray-900 font-bold underline hover:text-[#f43f5e] transition-colors" href={"/register"}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
