import axios from "axios";
import { logger } from "@source/Lib/utils/Logger";

const createGameFlex = async () => {
  try {
    const response = await axios.post("/game_bp/api_0/game/flex/new", {
      withCredentials: true,
    });
    if (response.data.status === "success") {
      return { route: response.data.route, game_id: response.data.game_id };
    } else {
      return false;
    }
  } catch (error) {
    logger.error("An error occursed in createGameFlex", error);
  }
};

const joinGameFlex = async (game_id) => {
  try {
    const response = await axios.post(
      `/game_bp/api_0/game/flex/${game_id}/join`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return { route: response.data.route, game_id: response.data.game_id };
    }
    if (response.data.status === "logged-out") {
      return { route: "authenticate", game_id: response.data.game_id };
    } else {
      return false;
    }
  } catch (error) {
    logger.error("An error occured in joinGameFlex:", error);
  }
};

const addPlayerToGameFlex = async (game_id) => {
  try {
    const response = await axios.post(
      `/game_bp/api_0/game/flex/${game_id}/player`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.player;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("An error occured in addPlayerToGameFlex:", error);
  }
};

const fetchPlayersFromGameFlex = async (game_id) => {
  try {
    const response = await axios.get(
      `/game_bp/api_0/game/flex/${game_id}/players`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.players;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("An error occured in fetchPlayersFromGameFlex:", error);
  }
};

export { fetchPlayersFromGameFlex };
export { createGameFlex };
export { joinGameFlex };
export { addPlayerToGameFlex };
