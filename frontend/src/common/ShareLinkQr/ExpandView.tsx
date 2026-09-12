import { BottomModalWrapper } from "@common/Modals/BottomModalWrapper";
import { ShareLinkQr } from "@common/ShareLinkQr/index";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { BsLink45Deg } from "react-icons/bs";

interface ExpandViewProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataUrl: string;
  valueToCopy?: string;
  qrCodeValue?: string;
}
const ExpandView: React.FC<ExpandViewProps> = ({
  dataUrl,
  setIsOpen,
  isOpen,
  qrCodeValue,
  valueToCopy,
}) => {
  return (
    <BottomModalWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      bgColor={"bg-tolopea"}
    >
      <div className={"flex h-full w-full items-center justify-around"}>
        <div className={"max-w-[225px]"}>
          <ShareLinkQr
            Icon={BsLink45Deg}
            label={"Copy link"}
            description={"You can send this link to your sea friends"}
            type={"copy"}
            className={"text-white"}
            valueToCopy={valueToCopy}
          />
        </div>
        <img src={dataUrl} alt={"qr"} className={"w-[464px] rounded-[18px]"} />
        <div className={"max-w-[225px]"}>
          <ShareLinkQr
            className={"text-white"}
            Icon={QrCodeIcon}
            label={"Download QR"}
            description={"Send a QR to your contacts"}
            type={"download"}
            qrCodeValue={qrCodeValue}
          />
        </div>
      </div>
    </BottomModalWrapper>
  );
};
export { ExpandView };
