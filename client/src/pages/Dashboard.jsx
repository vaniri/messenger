import React from "react";
import LogOut from "../components/LogOut";

const Dashboard = ({ userInfo }) => {
  const { userId, username } = userInfo;
  return (
    <>
      {/* For testing purposes right now, ignore styling */}
      <p>Dashboard for {username} {userId}</p>
      <LogOut />
    </>
  );
}

export default Dashboard;