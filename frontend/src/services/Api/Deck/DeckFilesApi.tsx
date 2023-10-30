import axios from "axios";

const getDeckFiles = async (deckId) => {
  try {
    const response = await axios.get(`/api/deck/${deckId}/files`, {
      withCredentials: true,
    });

    if (response.data.status === "success") {
      return response.data.files;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const downloadDeckFileAsPdf = async (deckId, fileId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/file/${fileId}/download`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `file_${fileId}.pdf`;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

const deleteDeckFile = async (deckId, fileId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/file/${fileId}`,
      {
        withCredentials: true,
      }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting the file:", error);
    return false;
  }
};

const getDeckFile = async (deckId, fileId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api_0/deck/${deckId}/file/${fileId}`,
      {
        withCredentials: true,
      }
    );

    if (response.data.status === "success") {
      return response.data.file;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting the file:", error);
    return false;
  }
};

export { deleteDeckFile };
export { downloadDeckFileAsPdf };
export { getDeckFiles };
export { getDeckFile };
