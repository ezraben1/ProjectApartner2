// src/Routes.tsx
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OwnerRoutes from "./pages/Owner/OwnerRoutes"; // Add this import
import Searcher from "./pages/Searcher/SearcherPage";
import Renter from "./pages/Renter/RenterPage";
import { useUserContext } from "./utils/UserContext";

function AppRoutes() {
  const { currentUser } = useUserContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/owner/*" element={<OwnerRoutes />} />
        <Route path="/searcher" element={<Searcher />} />
        <Route path="/renter" element={<Renter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
