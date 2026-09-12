const URL = "http://127.0.0.1:8765/";
const ACTION = "requestPermission";
const VERSION = 6;

const requestAnkiConnect = async (): Promise<void> => {
  const url = URL;
  const request = {
    action: ACTION,
    version: VERSION,
  };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
  });
  const data = await response.json();
  return data;
};

const invoke = async (
  action: string,
  version: string | number,
  params = {}
): Promise<void> => {
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", () => {
      reject(new Error("Failed to issue request"));
    });
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length !== 2) {
          throw new Error("response has an unexpected number of fields");
        }
        if (!response.hasOwnProperty("error")) {
          throw new Error("response is missing required error field");
        }
        if (!response.hasOwnProperty("result")) {
          throw new Error("response is missing required result field");
        }
        if (response.error) {
          throw new Error(response.error);
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open("POST", URL);
    xhr.send(JSON.stringify({ action, version, params }));
  });
};

const getDecks = async (deckNames = []): Promise<any> => {
  const allDecks = await invoke("deckNames", 6);

  const resultDecks: object[] = [];
  // Recursive function to get all subdecks
  const getSubdecks = (deckName: any): void => {
    const subdeckPrefix = deckName + "::";
    const subdecks = allDecks.filter((d) => d.startsWith(subdeckPrefix));
    for (const subdeck of subdecks) {
      resultDecks.push(subdeck);
      getSubdecks(subdeck);
    }
  };

  if (deckNames?.length === 0) {
    return allDecks;
  }

  for (const specifiedDeckName of deckNames) {
    if (allDecks.includes(specifiedDeckName)) {
      resultDecks.push(specifiedDeckName);
      getSubdecks(specifiedDeckName); // Fetch the subdecks recursively
    }
  }

  return resultDecks;
};

const getCardsByDeck = async (decks: any): Promise<any> => {
  const cardsByDeck = {};
  for (const deck of decks) {
    const cardIds = await invoke("findCards", 6, {
      query: `deck:"${deck}" -deck:"${deck}::*"`,
    });

    if (cardIds.length === 0) {
      continue;
    }

    const cards = await invoke("cardsInfo", 6, { cards: cardIds });

    cardsByDeck[deck] = cards.map((card) => {
      const fields = {};
      for (const [key, value] of Object.entries(card.fields)) {
        fields[key] = value.value;
      }
      return {
        id: card.noteId,
        fields,
        interval: card.interval,
      };
    });
  }
  return cardsByDeck;
};

const formatDataForBackend = (cardsByDeck: any): object => {
  const data = [];
  for (const deckName of Object.keys(cardsByDeck)) {
    const deckCards = cardsByDeck[deckName];
    for (const card of deckCards) {
      data.push({
        deckName,
        modelName: "Basic",
        fields: card.fields,
        options: {
          allowDuplicate: false,
        },
        tags: [],
        id: card.id,
        interval: card.interval,
      });
    }
  }
  return data;
};

export { formatDataForBackend, getCardsByDeck, getDecks, requestAnkiConnect };
