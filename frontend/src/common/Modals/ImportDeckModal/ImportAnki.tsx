import AnkiIcon from "@assets/AnkiIconPng.png";
import { DeckService } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { useToast } from "@source/lib/contexts/ToastContext";
import { useAppDispatch } from "@source/lib/store/hooks";
import { importCardsFromAnki } from "@store/cards/actions";
import React, { useState } from "react";

import { AnkiDeckSelect } from "./AnkiDeckSelect";
import {
  formatDataForBackend,
  getCardsByDeck,
  getDecks,
  requestAnkiConnect,
} from "./ankiFunctions";

interface ImportAnkiProps {
  deckId: number;
}

const ImportAnki: React.FC<ImportAnkiProps> = ({ deckId }) => {
  const [ankiDecks, setAnkiDecks] = useState<any[]>([]);
  const [selectedDecks, setSelectedDecks] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const dispatch = useAppDispatch();
  const { postToast } = useToast();
  // useEffect(() => {

  //   void requestAnkiConnect();
  //   const getAnkiDecks = async (): Promise<void> => {
  //
  //     const response = await getDecks();

  //     setAnkiDecks(response);
  //   };
  //   void getAnkiDecks();
  // }, []);

  const burntToast = {
    message: "Failed to connect to Anki",
    title: "Error!",
  };

  const frenchToast = {
    message: "Connected to Anki",
    title: "Success!",
  };

  const importToast = {
    message: "Importing Deck(s)",
    title: "Success!",
  };

  const handleAnkiConnect = async (): Promise<void> => {
    try {
      const response = await requestAnkiConnect();

      // TODO: Add a type for the response
      if (response.result.permission === "granted") {
        setConnected(true);
        postToast(frenchToast);
      } else {
        setConnected(false);
        postToast(burntToast);
      }
    } catch (e) {
      setConnected(false);
      postToast(burntToast);
    }

    const getAnkiDecks = async (): Promise<void> => {
      const response = await getDecks();
      setAnkiDecks(response);
    };
    void getAnkiDecks();
  };

  const handleAddingDeck = (deck: object): void => {
    if (selectedDecks.includes(deck)) {
      setSelectedDecks(selectedDecks.filter((d) => d !== deck));
    } else {
      setSelectedDecks([...selectedDecks, deck]);
    }
  };

  const importSelectedDecks = async (): Promise<void> => {
    const cardsByDeck = await getCardsByDeck(selectedDecks);
    const formattedData = formatDataForBackend(cardsByDeck);
    void DeckService.importAnkiCards(deckId, { cards: formattedData });
    void dispatch(importCardsFromAnki({ deckId, cardData: formattedData }));
    postToast(importToast);
  };

  return (
    <>
      <div className="h-auto overflow-auto p-4">
        {!connected && (
          <div>
            <h1>Connect Cephadex with Anki</h1>

            <button
              onClick={handleAnkiConnect}
              className={
                "mx-auto mt-[20px]  flex items-center justify-center gap-x-[16px] rounded-full bg-electric-violet px-[34px] py-[6px] "
              }
            >
              <img src={AnkiIcon} />
              <p className={"font-medium"}>Connect with Anki</p>
            </button>
          </div>
        )}
        {ankiDecks?.map((deck, index) => (
          <div key={index} className="p-1">
            <AnkiDeckSelect
              ankiDeck={deck}
              handleInputChange={handleAddingDeck}
            />
          </div>
        ))}
      </div>{" "}
      {connected ? (
        <Button label={"Import"} onClick={importSelectedDecks} />
      ) : (
        <p className="flex p-4">
          To connect to Anki you need to be on a desktop with Anki and Anki
          Connect open
        </p>
      )}
    </>
  );
};
export { ImportAnki };
