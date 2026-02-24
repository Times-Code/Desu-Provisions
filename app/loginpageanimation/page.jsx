"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import a from "../../public/a.jpg";
import b from "../../public/b.jpg";
import c from "../../public/c.jpg";
import d from "../../public/d.jpg";
import e from "../../public/e.jpg";
import f from "../../public/f.jpg";

const TiltedScroll = () => {
  return (
    <section className="flex justify-center items-center hidden md:block">
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: a.src, // Imported image
  },
  {
    id: 2,
    src: b.src, // Imported image
  },
  {
    id: 3,
    src: c.src, // Imported image
  },
  {
    id: 4,
    src: d.src, // Imported image
  },
  {
    id: 5,
    src: e.src, // Imported image
  },
  {
    id: 6,
    src: f.src, // Imported image
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        borderRadius: "4px",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 lg:h-[350px] lg:w-[450px] h-[300px] w-[300px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default TiltedScroll;
