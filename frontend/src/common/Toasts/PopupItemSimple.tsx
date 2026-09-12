import React from "react";

interface FrenchToast {
  img?: any;
  message: string;
  timeCreated?: string;
  title: string;
  onClick?: () => void;
  type?: string;
}

interface PopupIteSimpleProps {
  closeToast?: () => void;
  toastProps?: any;
  frenchToast: FrenchToast;
}

const PopupItemSimple: React.FC<PopupIteSimpleProps> = ({
  closeToast,
  toastProps,
  frenchToast,
}) => {
  return (
    <>
      <div
        className={
          "flex items-center  gap-x-[12px] p-[12px] dark:text-white text-tolopea"
        }
        onClick={frenchToast.onClick}
      >
        {frenchToast.img != null && frenchToast.img}

        <div className={"text-left"}>
          <h1 className={"font-semibold"}>{frenchToast.title}</h1>
          <p className={"text-[14px] font-medium"}>{frenchToast.message}</p>
          {frenchToast.timeCreated != null && (
            <p className={"text-[10px] opacity-70"}>
              {frenchToast.timeCreated}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
export { PopupItemSimple };
