import { useState, useEffect } from "react";
import { getCurrentUser } from "../api";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div>
      {user ? <h1>Welcome back, {user.username}!</h1> : <p>Loading...</p>}
    </div>
  );
};

export default Home;