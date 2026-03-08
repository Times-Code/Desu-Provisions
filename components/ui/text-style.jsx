"use client"

import React from "react";
import { motion } from "motion/react";

export const DrawCircleText = () => {
  return (
    <div className="text-center w-full mb-10 z-10 relative">
      <h1 className="text-center text-[#ffa6b6] text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium tracking-tight leading-tight">
        <span className="hidden md:inline-block">
          Streamline Grocery{" - "}
        </span> Login to {" "}
        <span className="relative inline-block text-[#f43f5e] font-black">
          Desu Provisions
        </span>{" "}
        <span className="hidden md:inline-block">
          Now!
        </span>
      </h1>
    </div>
  );
};