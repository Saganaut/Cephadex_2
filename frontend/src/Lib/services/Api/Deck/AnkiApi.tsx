import axios from "axios";
import { logger } from "@utils/Logger";

const importFromAnki = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/deck_bp/api_0/deck/import_anki",
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.details;
    } else {
      return false;
    }
  } catch (error) {
    logger.error(error);
  }
};

const exportToAnki = async (deckId) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/deck_bp/api_0/deck/${deckId}/export_anki`,
      { deckId: deckId },
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error(error);
  }
};

export { exportToAnki };
export { importFromAnki };
