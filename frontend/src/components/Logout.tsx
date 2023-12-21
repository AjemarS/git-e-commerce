import React from "react";

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
