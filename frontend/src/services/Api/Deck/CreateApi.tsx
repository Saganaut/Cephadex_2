import { data } from "autoprefixer";
import axios from "axios";

const extract = async (data) => {
  console.log(data);
  const extractFormData = new FormData();
  for (const key in data) {
    if (key === "fileField" && data[key] instanceof File) {
      console.log("found file");
      extractFormData.append(key, data[key]);
    } else {
      extractFormData.append(key, data[key]);
    }
  }
  console.log(extractFormData);
  try {
    const response = await axios.post(
      "http://localhost:5000/extract_bp/api_0/extraction",
      extractFormData,
      {
        withCredentials: true,
      }
    );
    if (response.data.status === "success") {
      return response.data.slug;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error(error);
  }
};

export { extract };
