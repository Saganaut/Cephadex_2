import { useAppDispatch } from "@source/lib/store/hooks";
import { logoutUser } from "@store/user/actions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = (): null => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const performLogout = async (): Promise<void> => {
      await dispatch(logoutUser());

      navigate("/logged-out");
    };

    void performLogout();
  }, [navigate, dispatch]);

  return null;
};

export { Logout };
