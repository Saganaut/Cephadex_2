import { ExpandView } from "@common/ShareLinkQr/ExpandView";
import { CheckIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ModalWrapper } from "../Modals/ModalWrapper";

interface ShareLinkQrProps {
  label?: string;
  Icon: any;
  description?: string;
  type: "copy" | "download" | "expand";
  valueToCopy?: string;
  qrCodeValue?: string;
  className?: string;
  setQrView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareLinkQr: React.FC<ShareLinkQrProps> = ({
  description,
  Icon,
  label,
  type,
  valueToCopy,
  qrCodeValue,
  className,
  setQrView,
}) => {
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    setDataUrl("data:image/png;base64," + qrCodeValue);
  }, [qrCodeValue]);
  const handleCopyLink = async (): Promise<void> => {
    try {
      if (typeof valueToCopy === "string") {
        await navigator.clipboard.writeText(valueToCopy);
      }
      setCopyStatus(true);
    } catch (e) {
      setCopyStatus(false);
    }
  };
  const handleDownloadQr = (): void => {
    fetch(dataUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        void response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "qrCode.png");
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {});
  };
  const handleExpand = (): void => {
    if (setQrView != null) {
      setQrView(true);
    }
  };
  return (
    <>
      <div
        onClick={
          type === "copy"
            ? handleCopyLink
            : type === "download"
            ? handleDownloadQr
            : handleExpand
        }
        className={twMerge(
          "group flex w-28 h-28  2xl:w-full 2xl:h-full cursor-pointer max-w-[400px] flex-col items-center justify-center rounded-2xl dark:bg-mariana-blue bg-electric-violet-200 2xl:p-6 dark:hover:bg-mariana-blue-100 hover:bg-electric-violet-200/70",
          className
        )}
      >
        <div
          className={`flex h-[54px] w-[54px] items-center justify-center rounded-full ${
            type === "copy"
              ? copyStatus
                ? "bg-blaze-orange group-hover:bg-blaze-orange"
                : "bg-mariana-blue-100 group-hover:bg-electric-violet"
              : "bg-mariana-blue-100 group-hover:bg-electric-violet"
          } `}
        >
          {copyStatus && type === "copy" && (
            <CheckIcon className={"h-[34px] w-[34px] text-white"} />
          )}
          {!copyStatus && <Icon className={"h-[34px] w-[34px] text-white"} />}
        </div>
        <h1 className={"pt-2 font-medium 2xl:text-lg 2xl:font-bold"}>
          {label}
        </h1>
        <p className={"hidden pt-2 text-center font-medium 2xl:block"}>
          {description}
        </p>
        {type === "expand" && (
          <ExpandView
            isOpen={isOpen}
            valueToCopy={valueToCopy}
            qrCodeValue={qrCodeValue}
            setIsOpen={setIsOpen}
            dataUrl={dataUrl}
          />
        )}
      </div>
    </>
  );
};
export { ShareLinkQr };
