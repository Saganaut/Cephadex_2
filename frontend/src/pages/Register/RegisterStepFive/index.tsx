import { useAppDispatch } from "@source/lib/store/hooks";
import { fetchUser } from "@source/lib/store/user/actions";
import React, { type ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterStepFiveProps {
  originalPage: string | undefined;
  setSpeech: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterStepFive: React.FC<RegisterStepFiveProps> = ({
  originalPage,
  setSpeech,
}): ReactElement => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(fetchUser());
    setSpeech("Welcome aboard! Click below to start your journey!");
  }, [dispatch, setSpeech]);
  // void dispatch(getUserStatus());
  const navigate = useNavigate();
  const redirectToOriginalPage = (): void => {
    if (originalPage == null) {
      navigate("/");
      return;
    }

    navigate(originalPage);
  };

  return (
    <div className="h-full  w-full  p-4">
      <div className="p-4">
        <div className=" flex items-center justify-center py-4 text-2xl text-white">
          <button
            onClick={redirectToOriginalPage}
            className="rounded-xl bg-blaze-orange px-4 py-2 text-white hover:bg-electric-violet"
          >
            Dive in!
          </button>
        </div>
      </div>
    </div>
  );
};

export { RegisterStepFive };
