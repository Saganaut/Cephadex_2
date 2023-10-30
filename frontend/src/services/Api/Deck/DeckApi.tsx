import axios from "axios";

const searchPublicDeck = async (data) => {
  const response = await axios.post(
    `http://localhost:5000/deck_bp/api_0/deck/public/search`,
    data
  );
  try {
    if (response.data.status === "success") {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    error.log(error);
  }
};

const fetchAllDecks = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/deck_bp/api_0/decks",
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      console.log(response.data);
      return response.data["decks"].map((deck) => ({ ...deck, type: "Deck" }));
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const setDeckAsFavorite = async (deckId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/favorite`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const removeDeckAsFavorite = async (deckId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/favorite`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

// delete deck

const deleteDeck = async (deckId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const getDeck = async (deckId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data["deck"];
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const editDeck = async (deckId) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const createDeck = async (deck) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/deck_bp/api_0/deck`,
      deck,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const downloadDeckCsv = async (deckId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/csv`,
      { withCredentials: true, responseType: "blob" } // <--- Set the responseType to 'blob'
    );

    // Check if the response data is available
    if (response.data) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `deck_${deckId}.csv`); // Give your CSV a name for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
    return false;
  }
};

const setChildDeck = async (parentId, childId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/deck_bp/api_0/deck/${parentId}/child/${childId}`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to set parent child relationship:",
      error
    );
  }
};

const deckLink = async (deckId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/link`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      const shareLink = response.data.share_link;
      const qrCodeImage = response.data.qr_code;
      return {
        success: true,
        shareLink: shareLink,
        qrCodeImage: qrCodeImage,
      };
    } else {
      return {
        success: false,
        error: "Failed to get deck link.",
      };
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to set parent child relationship:",
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

const getSharedDecks = async (deckId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/shared_decks`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data.shared_decks;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to get shared decks:", error);
  }
};

const deleteSharedDeck = async (deckId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/deck_bp/api_0/shared_deck/${deckId}`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to delete shared deck:",
      error
    );
  }
};

const approveSharedDeck = async (deckId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/deck_bp/api_0/shared_deck/${deckId}/approve`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return response.data.deck;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to approve shared deck:",
      error
    );
  }
};

const shareDeck = async (deckId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/deck_bp/api_0/share_deck/${deckId}/`,
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      return {
        users: response.data.users,
        "not-users": response.data.not_users,
      };
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to share deck:", error);
  }
};

export { shareDeck };
export { approveSharedDeck };
export { deleteSharedDeck };
export { getSharedDecks };
export { deckLink };
export { setChildDeck };
export { downloadDeckCsv };
export { createDeck };
export { editDeck };
export { getDeck };
export { deleteDeck };
export { removeDeckAsFavorite };
export { setDeckAsFavorite };
export { fetchAllDecks };
export { searchPublicDeck };
