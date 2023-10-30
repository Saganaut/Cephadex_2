import axios from "axios";

const getCardsFromDeck = async (deckId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/decks/${deckId}/cards`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data.cards;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCard = async (deckId, cardId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/card/${cardId}`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createCard = async (deckId, card) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/card`,
      card,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data.card;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const editCard = async (deckId, cardId, card) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/card/${cardId}`,
      card,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data.card;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const regenerateDefinition = async (deckId, cardId, details) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/card/${cardId}/regenerate`,
      details,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data.card;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export { regenerateDefinition };
export { editCard };
export { createCard };
export { deleteCard };
export { getCardsFromDeck };
