import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, axios } = useAppContext();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        toast.success("✅ Logged out successfully");
        setMenuOpen(false);
      }
    } catch (error) {
      toast.error("❌ Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/article?search=${encodeURIComponent(search)}`);
      setSearch("");
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "📚 Knowledge", path: "/article" },
    { name: "💬 Forum", path: "/forum" },
    { name: "🛒 Market", path: "/product" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled
          ? "shadow-xl border-b-4 border-[#2E7D32]"
          : "shadow-md border-b-2 border-[#2E7D32]"
      }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div
            onClick={() => navigate("/article")}
            className="cursor-pointer hover:opacity-80 transition flex items-center gap-2 group">
            <div className="w-11 h-11 bg-linear-to-br from-[#2E7D32] to-[#1b5e20] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
              🌾
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-black text-lg text-[#2E7D32]">
                KrishiSathi
              </span>
              <span className="text-xs text-green-600 font-semibold">
                Farming Advisory
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-[#2E7D32] text-white shadow-lg scale-105"
                    : "text-gray-700 hover:text-white hover:bg-[#2E7D32] hover:shadow-md"
                }`}>
                {item.name}
              </button>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-linear-to-br from-[#2E7D32] via-[#2b7030] to-[#1b5e20] text-white px-3 md:px-5 py-2.5 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-300">
                  <div className="w-7 h-7 rounded-full bg-white text-[#2E7D32] flex items-center justify-center text-xs font-black shadow-md">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline text-sm font-semibold">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span
                    className={`text-base transition-transform ${
                      menuOpen ? "rotate-180" : ""
                    }`}>
                    ▼
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50">
                    {/* Profile Section */}
                    <div className="bg-linear-to-r from-[#2E7D32] to-[#1b5e20] text-white p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white text-[#2E7D32] flex items-center justify-center text-lg font-black shadow-lg">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-base">{user.name}</p>
                          <p className="text-xs opacity-90">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2 text-xs font-bold">
                        <span>👤 {user.role?.toUpperCase() || "USER"}</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-[#2E7D32] flex items-center gap-3 transition-all border-l-4 border-transparent hover:border-[#2E7D32]">
                        <span className="text-xl">📊</span> Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate("/article/new");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-[#2E7D32] flex items-center gap-3 transition-all border-l-4 border-transparent hover:border-[#2E7D32]">
                        <span className="text-xl">✍️</span> Create Article
                      </button>
                      <button
                        onClick={() => {
                          navigate("/forum/new");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-gray-700 font-bold hover:bg-green-50 hover:text-[#2E7D32] flex items-center gap-3 transition-all border-l-4 border-transparent hover:border-[#2E7D32]">
                        <span className="text-xl">💬</span> New Discussion
                      </button>

                      {/* Admin Section */}
                      {user.role === "admin" && (
                        <>
                          <div className="border-t border-gray-200 my-2"></div>
                          <button
                            onClick={() => {
                              navigate("/admin/products");
                              setMenuOpen(false);
                            }}
                            className="w-full text-left px-5 py-3 text-purple-600 font-bold hover:bg-purple-50 hover:text-purple-700 flex items-center gap-3 transition-all border-l-4 border-transparent hover:border-purple-600">
                            <span className="text-xl">👑</span> Admin Panel
                          </button>
                        </>
                      )}

                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-all border-l-4 border-transparent hover:border-red-600">
                        <span className="text-xl">🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="bg-[#2E7D32] hover:bg-[#1b5e20] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🔐 Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-2xl text-gray-600 hover:text-[#2E7D32] p-2 hover:bg-green-50 rounded-lg transition-all">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#2E7D32] bg-linear-to-b from-white to-gray-50 py-4 px-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-2 border-gray-300 rounded-full px-4 py-2.5 outline-none focus:border-[#2E7D32] focus:shadow-md font-medium text-sm"
              />
              <button
                type="submit"
                className="text-2xl p-2 hover:bg-green-100 rounded-full transition-all">
                🔍
              </button>
            </form>

            {/* Mobile Nav */}
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive(item.path)
                    ? "bg-[#2E7D32] text-white shadow-lg"
                    : "text-gray-700 hover:bg-green-50 hover:text-[#2E7D32]"
                }`}>
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
