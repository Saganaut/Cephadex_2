const URL = "http://127.0.0.1:8765/";
const ACTION = "requestPermission";
const VERSION = 6;

const requestAnkiConnect = async (): Promise<any> => {
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

// let str: string | null = null;
// if (str != null && !str) {

// }
// example, foo.hasOwnProperty("bar") should be replaced with Object.prototype.hasOwnProperty.call(foo, "bar").
async function invoke(action, version, params = {}) {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", () => {
      reject("failed to issue request");
    });
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw "response has an unexpected number of fields";
        }
        if (!response.hasOwnProperty("error")) {
          throw "response is missing required error field";
        }
        if (!response.hasOwnProperty("result")) {
          throw "response is missing required result field";
        }
        if (response.error) {
          throw response.error;
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open("POST", "http://127.0.0.1:8765");
    xhr.send(JSON.stringify({ action, version, params }));
  });
}

const getDecks = async (deckNames = []): Promise<any> => {
  const allDecks = await invoke("deckNames", 6);
  const resultDecks: any[] = [];
  // Recursive function to get all subdecks
  const getSubdecks = (deckName: string): void => {
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
    if (allDecks.includes(specifiedDeckName) as boolean) {
      resultDecks.push(specifiedDeckName);
      getSubdecks(specifiedDeckName); // Fetch the subdecks recursively
    }
  }

  return resultDecks;
};

const getCardsByDeck = async (decks: object): Promise<object> => {
  const cardsByDeck = {};
  for (const deck of Object.values(decks)) {
    const cardIds = await invoke("findCards", 6, {
      query: `deck:"${deck}" -deck:"${deck}::*"`,
    });

    if (cardIds.length === 0) {
      continue;
    }

    const cards = await invoke("cardsInfo", 6, { cards: cardIds });

    cardsByDeck[deck] = cards.map((card: any) => {
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
