import { ShareLinkQr } from "@common/ShareLinkQr";
import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { MdOutlineQrCodeScanner } from "react-icons/md";

interface GenerateTabProps {
  itemId?: number;
  type: "quiz" | "deck" | "game";
  link: string;
  qrCodeValue: string;
  setQrView: React.Dispatch<React.SetStateAction<boolean>>;
}
const GenerateTab: React.FC<GenerateTabProps> = ({
  itemId,
  type,
  link,
  qrCodeValue,
  setQrView,
}) => {
  // const [dataUrl, setDataUrl] = useState("");

  // const navigate = useNavigate();
  // useEffect(() => {
  // setDataUrl("data:image/png;base64," + qrCodeValue);
  // }, [qrCodeValue]);
  return (
    <div className={"flex justify-center"}>
      <div className={"m-4 mx-auto flex w-[90%] justify-center gap-x-[20px]"}>
        <ShareLinkQr
          description={"You can send this link to your sea friends"}
          type={"copy"}
          valueToCopy={link}
          label={"Copy link"}
          Icon={BsLink45Deg}
        />
        {/* <div className="max-h-4 w-full">
          <img src={dataUrl} alt={"qr"} className={"w-full rounded-[18px]"} />
        </div> */}
        <ShareLinkQr
          label={"QR code"}
          type={"expand"}
          Icon={MdOutlineQrCodeScanner}
          description={"Send a QR to your contacts"}
          qrCodeValue={qrCodeValue}
          setQrView={setQrView}
        />
      </div>
    </div>
  );
};
export { GenerateTab };
