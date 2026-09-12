import React from "react";

const loaderStyles = {
  "--r1": "154%",
  "--r2": "68.5%",
  width: "60px",
  aspectRatio: "1",
  borderRadius: "50%",
  background:
    "radial-gradient(var(--r1) var(--r2) at top   ,#6019FF 79.5%,#54FFF1 80%), radial-gradient(var(--r1) var(--r2) at bottom,#54FFF1 79.5%,#6019FF 80%), radial-gradient(var(--r1) var(--r2) at top   ,#6019FF 79.5%,#54FFF1 80%), #ccc",
  backgroundSize: "50.5% 220%",
  backgroundPosition: "-100% 0%,0% 0%,100% 0%",
  backgroundRepeat: "no-repeat",
  animation: "l9 2s infinite linear",
};
const CircleWave: React.FC = () => {
  return <div style={loaderStyles}> </div>;
};

export { CircleWave };
