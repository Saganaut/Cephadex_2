import axios from "axios";

const sendGoogleSignInToken = async (credentialResponse) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/user_bp/api_0/auth/google-sign-in",
      credentialResponse,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.status === "success") {
      console.log("Login successful:", response.data);
    } else {
      console.error("Login failed:", response.data.error);
    }
  } catch (error) {
    console.error("An error occurred while sending token to backend:", error);
  }
};

export { sendGoogleSignInToken };
