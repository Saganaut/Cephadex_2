import { axiosPrivate } from "@services/axios";

const getStudyCards = async (): Promise<any> => {
  try {
    const response = await axiosPrivate.get("/study_bp/api_0/study/data/23 ");
    console.log(response.data);
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
    return { isLoggedIn: false, user: null };
  }
};

export { getStudyCards };
