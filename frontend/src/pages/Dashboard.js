import React from "react";
import Projects from "./Projects";
import Tasks from "./Tasks";
import Users from "./Users";

export default function Dashboard({ onLogout }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
      <Projects />
      <Tasks />
      <Users />
    </div>
  );
}
