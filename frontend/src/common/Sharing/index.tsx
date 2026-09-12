import {
  DeckService,
  type LinkAndQrCodeResponse,
  QuizService,
} from "@source/client";
import { AssignTab } from "@source/common/Sharing/Tabs/AssignTab";
import { GenerateTab } from "@source/common/Sharing/Tabs/GenerateTab";
import { ShareTab } from "@source/common/Sharing/Tabs/ShareTab";
import React, { useEffect, useState } from "react";

import { Button } from "../Buttons/Button";
import { PreferencesSelect } from "../Form/PreferencesSelect/PreferencesSelect";

interface SharerStandardProps {
  activeIndex?: number;
  setActiveIndex?: (index: number) => void;
  options?: Array<{ label: string; value: string; icon?: any }>;
  type: "quiz" | "deck" | "game";
  itemId?: number;
  valueToCopyProp?: string;
  qrCodeValueProp?: string;
  preferencesSelect?: boolean;
}

// TODO: this needs to be refactored it works but its a mess
const SharerStandard: React.FC<SharerStandardProps> = ({
  setActiveIndex,
  activeIndex = 1,
  options = [],
  type,
  itemId,
  qrCodeValueProp,
  valueToCopyProp,
  preferencesSelect = true,
}) => {
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  const [valueToCopy, setValueToCopy] = useState<string>("");
  const [dataUrl, setDataUrl] = useState("");

  // const { postToast } = useToast();
  const [qrView, setQrView] = useState<boolean>(false);
  const [shareResponse, setShareResponse] =
    useState<LinkAndQrCodeResponse | null>(null);

  useEffect(() => {
    const handleCopyLink = async (): Promise<void> => {
      if (type === "quiz") {
        const response = await QuizService.getShareLinkForQuiz(itemId);
        await navigator.clipboard.writeText(response.shareLink);
        setShareResponse(response);
      }
      if (type === "deck") {
        const response = await DeckService.getShareLinkForDeck(itemId);
        await navigator.clipboard.writeText(response.shareLink);
        setShareResponse(response);
      }
      if (type === "game") {
        setShareResponse({
          status: "",
          message: "",
          qrCode: qrCodeValueProp ?? "",
          shareLink: valueToCopyProp ?? "",
        });
      }
      setQrCodeValue(shareResponse?.qrCode ?? "");
      setValueToCopy(shareResponse?.shareLink ?? "");
      setDataUrl("data:image/png;base64," + qrCodeValue);
    };
    void handleCopyLink();
  }, [
    itemId,
    type,
    shareResponse?.shareLink,
    shareResponse?.qrCode,
    qrCodeValue,
    qrCodeValueProp,
    valueToCopyProp,
  ]);

  // const navigate = useNavigate();
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
  return (
    <div className={"mx-auto w-full text-center"}>
      {qrView ? (
        <div>
          <div className="flex items-start justify-start p-2">
            <Button
              className="border-2 border-white bg-transparent text-white lg:py-[2px] "
              label={"Back"}
              onClick={() => {
                setQrView(false);
              }}
            />
          </div>
          <div
            className={"flex h-full w-full items-center justify-around gap-3"}
          >
            {/* <div className={"max-w-[225px]  hidden md:block"}>
              <ShareLinkQr
                Icon={BsLink45Deg}
                label={"Copy link"}
                description={"You can send this link to your sea friends"}
                type={"copy"}
                className={"text-white"}
                valueToCopy={valueToCopy}
              />
            </div> */}
            <div className="cursor-pointer" onClick={handleDownloadQr}>
              <img
                src={dataUrl}
                alt={"qr code"}
                className={"w-[464px] rounded-[18px]"}
              />
              <p className="text-white underline">
                {" "}
                Click to download QR code{" "}
              </p>
            </div>
            {/* <div className={"max-w-[225px] hidden md:block"}>
              <ShareLinkQr
                className={"text-white"}
                Icon={QrCodeIcon}
                label={"Download QR"}
                description={"Send a QR to your contacts"}
                type={"download"}
                qrCodeValue={qrCodeValue}
              />
            </div> */}
          </div>
        </div>
      ) : (
        <>
          {preferencesSelect && (
            <>
              <h1 className={"mb-[20px] text-2xl font-semibold"}>
                {type === "deck" ? "Share your deck" : "Ready to share?"}
              </h1>
              <div className={"mb-[32px]"}>
                <PreferencesSelect
                  label={""}
                  className={"mx-auto"}
                  setActiveIndex={setActiveIndex ?? (() => {})}
                  activeIndex={activeIndex}
                  options={options}
                />
              </div>
            </>
          )}
          {activeIndex === 0 && type !== "game" && itemId != null && (
            // Assign
            <AssignTab type={type} itemId={itemId} />
          )}
          {activeIndex === 1 && (
            // Generate
            <GenerateTab
              type={type}
              itemId={itemId}
              link={valueToCopy}
              qrCodeValue={qrCodeValue}
              setQrView={setQrView}
            />
          )}
          {activeIndex === 2 && type !== "game" && itemId != null && (
            // Share
            <ShareTab itemId={itemId} type={type} link={valueToCopy} />
          )}
        </>
      )}
    </div>
  );
};

export { SharerStandard };
