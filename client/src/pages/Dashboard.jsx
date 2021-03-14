import React from "react";

const Dashboard = ({ userId, username, logout }) => {
  return (
    <>
      {/* For testing purposes right now, ignore styling */}
      <p>Dashboard for {username} {userId}</p>
      <button onClick={logout}>
        Logout
      </button>
    </>
  );
}

export default Dashboard;