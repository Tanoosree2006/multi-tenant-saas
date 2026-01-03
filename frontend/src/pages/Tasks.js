import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchWithToken("/tasks").then(res => {
      if (res.success) setTasks(res.data);
    });
  }, []);

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
