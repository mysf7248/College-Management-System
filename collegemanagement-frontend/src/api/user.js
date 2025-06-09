const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function getAllUsers(token) {
  const res = await fetch(`${API}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
}