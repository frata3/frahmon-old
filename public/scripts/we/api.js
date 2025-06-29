export async function fetchChatHTML(username) {
  console.log("[API] Fetching chat HTML for:", username);
  const { data } = await axios.get(`/we/dm/${username}`);
  return data; 
}
