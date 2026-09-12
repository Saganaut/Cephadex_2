import { DeckService } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useToast } from "@source/lib/contexts/ToastContext";
import React, { useEffect } from "react";

import { requestAnkiConnect } from "../ImportDeckModal/ankiFunctions";

interface ExportAnkiProps {
  deckId: number;
}
const ExportAnki: React.FC<ExportAnkiProps> = ({ deckId }) => {
  const [ankiConnect, setAnkiConnect] = React.useState(false);
  const { postToast } = useToast();

  const burntToast = {
    message: "Failed to connect to Anki",
    title: "Error!",
  };

  const frenchToast = {
    message: "Connected to Anki",
    title: "Success!",
  };

  const exportToast = {
    message: "Exporting Deck",
    title: "Success!",
  };

  const connectToAnki = async (): Promise<void> => {
    try {
      const response = await requestAnkiConnect();
      if (response.result.permission === "granted") {
        setAnkiConnect(true);

        postToast(frenchToast);
      } else {
        setAnkiConnect(false);

        postToast(burntToast);
      }
    } catch (e) {
      setAnkiConnect(false);
      postToast(burntToast);
    }
  };

  useEffect(() => {
    void connectToAnki();
  });

  const exportDeck = (): void => {
    void DeckService.exportDeckToAnki(deckId);
    postToast(exportToast);
  };
  return (
    <>
      <div className="overflow-auto p-4">
        {ankiConnect ? (
          <Button label={"Export"} onClick={exportDeck} />
        ) : (
          <div className="mx-auto max-w-[300px] text-tolopea dark:text-white">
            To export your deck to Anki you must be on a computer have anki and
            anki connect open.
          </div>
        )}
      </div>{" "}
    </>
  );
};

export { ExportAnki };
