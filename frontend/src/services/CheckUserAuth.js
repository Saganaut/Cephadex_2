import axios from 'axios';


const checkUserAuth = async() => {
    try {
      const response = await axios.get('http://localhost:5000/user_bp/api_0/auth/status', { withCredentials: true });
      if (response.data.status === 'success') {
        console.log('User is logged in:', response.data);
        return response.data['user'];
      } else {
        console.error('User is not logged in:', response.data.error);
        return false;
      }
    } catch (error) {
      console.error('An error occurred while sending token to backend:', error);
    }
  };

  export { checkUserAuth }