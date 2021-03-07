import React from "react";
import { useEffect } from "react";
import { Button, CssBaseline, TextField, Paper }from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Dashboard() {
  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("token");
    if (!user) history.push("/signup");
  }, []);

  return (
    <>
      {/* For testing purposes right now, ignore styling */}
      <p>Dashboard</p>
      <p>User: {JSON.stringify(localStorage.getItem("token"))}</p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          history.push("/login");
        }}
      >
        Logout
      </button>
    </>
  );
}
