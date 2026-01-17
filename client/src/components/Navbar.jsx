import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex gap-10">
      <Link to="/" className="text-[#6D4C41] hover:text-[#3E2723]">
        Home
      </Link>
      <Link to="/article" className="text-[#6D4C41] hover:text-[#3E2723]">
        Article
      </Link>
      <Link to="/product" className="text-[#6D4C41] hover:text-[#3E2723]">
        Market
      </Link>
      <Link to="/forum" className="text-[#3E2723] font-bold">
        Forum
      </Link>
    </nav>
  );
};

export default Navbar;
