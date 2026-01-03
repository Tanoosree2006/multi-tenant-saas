import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchWithToken("/projects").then(res => {
      if (res.success) setProjects(res.data);
    });
  }, []);

  return (
    <div>
      <h3>Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
