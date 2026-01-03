import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchWithToken("/tenants/users").then(res => {
      if (res.success) setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </div>
  );
}
