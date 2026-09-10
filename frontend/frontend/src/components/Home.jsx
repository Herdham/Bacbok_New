import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api";

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        // token is invalid/expired — send back to login
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (error) {
    return <p style={{ color: "red" }}>Something went wrong: {error}</p>;
  }

  return (
    <div style={{ color: "#ffffff", padding: "2rem" }}>
      {user ? <h1>Welcome back, {user.username}!</h1> : <p>Loading...</p>}
    </div>
  );
};

export default Home;