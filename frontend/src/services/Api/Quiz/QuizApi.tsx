import axios from "axios";

const fetchAllQuizzes = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/quiz_bp/api_0/quizzes",
      { withCredentials: true }
    );

    if (response.data.status === "success") {
      console.log("QUizzes", response.data);
      return response.data["quizzes"].map((quiz) => ({
        ...quiz,
        type: "Quiz",
      }));
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

const setQuizAsFavorite = async (quizId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/favorite`,
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

const removeQuizAsFavorite = async (quizId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/favorite`,
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

const downloadQuizPdf = async (quizId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/download`,
      {
        responseType: "blob", // Important! Treats the response as binary data
        withCredentials: true,
      }
    );

    // Create a blob from the response for download
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a link element to initiate download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quiz_${quizId}.pdf`; // Modify the download filename if needed
    link.click();

    // Cleanup
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading the quiz:", error);
  }
};

const deleteQuestion = async (quizId, questionId) => {
  const response = await axios.delete(
    `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/question/${questionId}`,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to delete a question:",
      error
    );
  }
};

const deleteQuiz = async (quizId) => {
  const response = await axios.delete(
    `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}`,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to delete a quiz:", error);
  }
};

const newQuiz = async (data) => {
  const response = await axios.post(
    `http://localhost:5000/quiz_bp/api_0/quiz`,
    data,
    { withCredentials: true },
    { headers: { "Content-Type": "application/json" } }
  );
  try {
    if (response.data.status === "success") {
      return response.data.quiz;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to create a quiz:", error);
  }
};

const editQuiz = async (quizId, data) => {
  const response = await axios.put(
    `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}`,
    data,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return response.data.quiz;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to create a quiz:", error);
  }
};

const quizLink = async (quizId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/link`,
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

const assignQuiz = async (quizId, data) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/assign`,
      data,
      { withCredentials: true },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.status === "success") {
      return true;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to assign quiz to deck:",
      error
    );
  }
};

const submitQuiz = async (quizId, data) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/result`,
      data,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.quiz_result_id;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to submit quiz:", error);
  }
};

const rejectAssignedQuiz = async (quizId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}/assigned_quiz`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to reject assigned quiz:",
      error
    );
  }
};

const fetchQuizResult = async (quizResultId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/quiz_result/${quizResultId}`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to get quiz result:", error);
  }
};

const fetchAllMyResults = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/quiz_result/my_results`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.results;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to get your quiz results:",
      error
    );
  }
};
const fetchAllMyStudentresults = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/quiz_result/my_students_results`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.results;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "An error occurred while trying to get your quiz results:",
      error
    );
  }
};

const fetchQuiz = async (quizId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/quiz/${quizId}`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return { quiz: response.data.quiz, questions: response.data.questions };
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to get quiz:", error);
  }
};

const fetchSharedQuiz = async (sharedQuizId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/quiz_bp/api_0/shared_quiz/${sharedQuizId}`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return { quiz: response.data.quiz, questions: response.data.questions };
    } else {
      return false;
    }
  } catch (error) {
    console.error("An error occurred while trying to get shared quiz:", error);
  }
};

export { fetchSharedQuiz };
export { fetchQuiz };
export { fetchAllMyResults };
export { fetchAllMyStudentresults };
export { fetchQuizResult };

export { rejectAssignedQuiz };
export { submitQuiz };
export { assignQuiz };

export { quizLink };
export { downloadQuizPdf };

export { editQuiz };
export { deleteQuiz };
export { newQuiz };
export { deleteQuestion };

export { removeQuizAsFavorite };
export { setQuizAsFavorite };
export { fetchAllQuizzes };
