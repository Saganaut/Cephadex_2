import React from "react";

import { HelmSpinner } from "../../Animations/Spinners/HelmSpinner";

interface LoadingProps {
  message?: string;
  type?: string;
  style?: string;
  size?: "large" | "small";
  withMessage?: boolean;
}
const Loading: React.FC<LoadingProps> = ({
  message,
  type,
  style,
  size = "large",
  withMessage = true,
}) => {
  return (
    <div className="flex  grow items-center justify-center">
      <div className="mx-auto text-center text-xs text-blaze-orange sm:text-xl">
        <HelmSpinner
          style={size}
          color="fill-blaze-orange max-h-[100px] sm:max-h-none"
        />
        <p className="text-center">
          {withMessage && (message ?? "Loading...")}
        </p>
      </div>
    </div>
  );
};

export { Loading };
