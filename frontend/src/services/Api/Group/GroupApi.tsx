import axios from "axios";

const createGroup = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/group", {
      credentialResponse: true,
    });
    if (response.data.status === "success") {
      return response.data.group;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteGroup = async (groupId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/group/${groupId}`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchAllGroups = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/group_bp/api_0/groups",
      {
        withCredentials: true,
      }
    );
    console.log("fetchAllGroups response:", response);
    if (response.data.status === "success") {
      return response.data["groups"].map((group) => ({
        ...group,
        type: "Group",
      }));
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const approveGroup = async (groupId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/group_bp/api_0/group/${groupId}/invitation`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.group;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const rejectGroup = async (groupId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/group_bp/api_0/group/${groupId}/invitation`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchAllUsersInvitedToGroup = async (groupId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/group_bp/api_0/group/${groupId}/invitaitons/all`,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return response.data.invited;
    } else {
      return false;
    }
  } catch (error) {}
};

const inviteUsersToGroup = async (groupId, data) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/group_bp/api_0/group/${groupId}/invite`,
      data,
      { withCredentials: true }
    );
    if (response.data.status === "success") {
      return true;
    }
    if (response.data.status === "fail") {
      return response.data.message;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateMemberPermissions = async (groupId, data) => {
  const response = await axios.put(
    `http://localhost:5000/group_bp/api_0/group/${groupId}/member/permissions`,
    data,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const removeMemberFromGroup = async (groupId, userId) => {
  const response = await axios.delete(
    `http://localhost:5000/group_bp/api_0/group/${groupId}/member/${userId})`,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const removeDeckFromGroup = async (groupId, deckId) => {
  const response = await axios.delete(
    `http://localhost:5000/group_bp/api_0/group/${groupId}/deck/${deckId}`,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchGroupsDecks = async (groupId) => {
  const response = await axios.get(
    `http://localhost:5000/group_bp/api_0/group/${groupId}/decks`,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return response.data.decks;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const addDeckToGroup = async (groupId, data) => {
  const response = await axios.post(
    `http://localhost:5000/group_bp/api_0/group/${groupId}/deck`,
    data,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return response.data.deck;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const saveDeckFromGroup = async (groupId, deckId) => {
  const response = await axios.post(
    `http://localhost:5000/group_bp/api_0/group/${groupId}/deck/${deckId}/save`,
    { withCredentials: true }
  );
  try {
    if (response.data.status === "success") {
      return response.data.deck;
    } else {
      return false;
    }
  } catch (error) {}
};

export { saveDeckFromGroup };
export { addDeckToGroup };
export { fetchGroupsDecks };
export { removeDeckFromGroup };
export { removeMemberFromGroup };
export { updateMemberPermissions };
export { inviteUsersToGroup };
export { fetchAllUsersInvitedToGroup };
export { rejectGroup };
export { approveGroup };
export { fetchAllGroups };
export { deleteGroup };
export { createGroup };
