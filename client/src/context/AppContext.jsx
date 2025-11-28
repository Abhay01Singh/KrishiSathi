import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on app load
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/isauth");
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const getRecommendation = async () => {
    try {
      const { data } = await axios.get("/api/land/recommend");
      if (data.success) {
        setRecommended(data.recommendedCrops);
      } else {
        toast.error(data.message || "Error getting recommendations");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  };

  const value = {
    user,
    setUser,
    navigate,
    axios,
    recommended,
    setRecommended,
    getRecommendation,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
