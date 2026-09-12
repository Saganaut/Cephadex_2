import { Loading } from "@source/common/InfoComponents/Loading";
import React, { useEffect, useState } from "react";

function DelayedFallback({ delay = 1000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  if (!show) {
    return null;
  }

  return <Loading />;
}

export { DelayedFallback };
