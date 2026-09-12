import { DeckService } from "@source/client";
import { useCallback } from "react";

const useDownloadDeckCsv = (): ((deckId: number) => Promise<void>) => {
  const downloadCsv = useCallback(async (deckId: number) => {
    const response = await DeckService.getDeckCsv(deckId);
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deck.csv");
    document.body.appendChild(link);
    link.click();
  }, []);

  return downloadCsv;
};

export { useDownloadDeckCsv };
