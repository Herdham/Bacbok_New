import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Forget from "./components/Forget";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Forgot password */}
        <Route path="/forgot-password" element={<Forget />} />

        {/* Default page */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;