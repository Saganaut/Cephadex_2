import { Button } from "@source/common/Buttons/Button";
import React from "react";
import { useNavigate } from "react-router-dom";

const InsufficientCredit: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <p>
        Okay so here&apos;s the bad news... You don&apos;t have enough credits
        left. Don&apos;t worry, there is good news though! You can get more
        credits by upgrading your account! Plus there&apos;s a free trial, so
        really you have nothing to lose!
      </p>{" "}
      <Button
        label="Upgrade"
        onClick={() => {
          navigate("/upgrade");
        }}
      />
    </>
  );
};

export { InsufficientCredit };
