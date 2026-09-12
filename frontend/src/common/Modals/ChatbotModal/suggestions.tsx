import React from "react";

interface ChatBotSuggestionsProps {
  handleWhyWrong: () => void;
  handleMoreInfo: () => void;
}
const ChatBotSuggestions: React.FC<ChatBotSuggestionsProps> = ({
  handleWhyWrong,
  handleMoreInfo,
}) => {
  return (
    <>
      {" "}
      <div className={"mb-[100px] mt-[50px]"}>
        {/* <div
          className={"mb-[8px] flex items-center justify-center gap-x-[10px]"}
        >
          <p
            onClick={handleWhyWrong}
            className={
              "cursor-pointer rounded-[20px] bg-blaze-orange px-[12px] py-[8px] text-left text-sm text-white transition-all duration-100 ease-linear hover:scale-[105%]"
            }
          >
            Was my answer correct?
          </p>
        </div> */}
        <div
          className={"mb-[14px] flex items-center justify-center gap-x-[10px]"}
        >
          <p
            onClick={handleMoreInfo}
            className={
              "cursor-pointer rounded-[20px] bg-blaze-orange px-[12px] py-[8px] text-left text-sm text-white transition-all duration-100 ease-linear hover:scale-105"
            }
          >
            I want to know more...
          </p>
        </div>
      </div>
    </>
  );
};

export { ChatBotSuggestions };
