import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/info_bp/api_0/blog`;

const fetchAllBlogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch_list_all_posts`);
    return response.data;
  } catch (error) {
    throw error; // You might want to handle the error more gracefully in a real application
  }
};

const fetchSingleBlog = async (slug) => {
  try {
    const response = await axios.get(`${BASE_URL}/${slug}`);
    return response.data;
  } catch (error) {
    throw error; // Similarly, consider better error handling here
  }
};

export { fetchAllBlogs, fetchSingleBlog };
