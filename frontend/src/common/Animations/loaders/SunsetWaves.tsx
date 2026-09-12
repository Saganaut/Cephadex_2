import React from "react";

const loaderStyles = {
  width: "80px",
  height: "80px",
  background:
    "radial-gradient(circle 11px at top,#0000 94%,#54FFF1) 0 20px, radial-gradient(circle 11px at top,#0000 94%,#3821AA) 0 10px, radial-gradient(circle 11px at top,#0000 94%,#190042) 0 0",
  backgroundSize: "20px 100%",
  backgroundRepeat: "repeat-x",
  animation: "l7 1s infinite linear",
};
const SunsetWaves: React.FC = () => {
  return (
    <div className="max-h-[50px] max-w-[80px] overflow-hidden rounded-md bg-mariana-blue-100">
      <div className="max-w-fit rounded-full bg-blaze-orange pt-2">
        <div className="rounded-md " style={loaderStyles}>
          {" "}
        </div>
      </div>
    </div>
  );
};

export { SunsetWaves };
