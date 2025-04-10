"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "@/components/loading2.json"; // Replace with your animation file path

export default function AnimatedLoader() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: "150px", width: "150px" }}
    />
  );
}
