import { Button } from "@source/common/Buttons/Button";
import { useToast } from "@source/lib/contexts/ToastContext";
import { useDownloadDeckCsv } from "@source/lib/hooks/deckHooks/useDownloadDeckCsv";
import React from "react";

interface ExportCSVProps {
  deckId: number;
}
const ExportCSV: React.FC<ExportCSVProps> = ({ deckId }) => {
  const { postToast } = useToast();
  const downloadCSV = useDownloadDeckCsv();
  const [downloadStarted, setDownloadStarted] = React.useState(false);
  const exportAsCsv = async (): Promise<void> => {
    void downloadCSV(deckId);
    setDownloadStarted(true);
    const frenchToast = {
      message: "Downloading your deck as CSV",
      title: "Success!",
    };
    postToast(frenchToast);
  };

  return (
    <>
      {" "}
      <div className="overflow-auto p-4">
        {downloadStarted ? (
          <div className="text-white">Downloading your deck as CSV</div>
        ) : (
          <Button label={"Download as CSV "} onClick={exportAsCsv} />
        )}
      </div>
    </>
  );
};

export { ExportCSV };
