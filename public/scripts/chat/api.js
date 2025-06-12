export async function fetchChatHTML(username) {
    const { data } = await axios.get(`/we/dm/${username}`);
    return data;
  }
  