import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAppDispatch } from "@store/hooks";
import { useNavigate } from "react-router-dom";

import { logoutThunk } from "@services/Api/User/UserApiThunks";

const Logout = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/blog");
  };
  return (
    <div className="text-white mt-40">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export { Logout };
