import axios from "axios";

const tutorExplain = async (cardId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api/card/${cardId}/explanation`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.response;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const tutorWrong = async (cardId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api/card/${cardId}/wrong_choice`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.response;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const tutorQuestion = async (cardId, data) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/deck_bp/api/card/${cardId}/question`,
      data,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.response;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export { tutorQuestion };
export { tutorExplain };
export { tutorWrong };
