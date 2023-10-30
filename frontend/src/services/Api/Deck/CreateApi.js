import { data } from "autoprefixer";
import axios from "axios";

const extract = async (data) => {
  const response = await axios.post(
    "http://localhost:5000/extract_bp/api_0/extraction",
    data,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return response.data.slug;
    } else {
      return response.data.message;
    }
  } catch (error) {
    error.log(error);
  }
};
