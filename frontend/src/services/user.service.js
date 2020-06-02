import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/";

const getPostsFeed = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.id) {
    return axios.get(
      API_URL + "feedForId",
      { headers: authHeader() },
      {
        data: {
          id: user.id,
        },
      }
    );
  }
};

export default {
  getPostsFeed,
};
