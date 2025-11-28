import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const CATEGORIES = [
  "All",
  "Best Practices",
  "Technology",
  "Soil Health",
  "Crop Management",
  "Market News",
];

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAXsd2-4eszYfS3eQKyrOEVcA0vT3ydxwN1gBoJqaSvYXY2FgacuArvd0LDGLP0ixKxow7d09Zgv3zDOZToZrzLOobjP79N-akBCkl9FwXQ4Den6PATp0Sr_vqU-m8HP-7AIqhGftQ6GFwE3g8z3H3JWarRWqv1GrWvjcD0_JJVBTDvLamChIEsDtxEqYetLFiOUQ92phnTH8sQsN_qlAr3N_x-WTJ5S-HHzAen6KUoZUJGeNo0KoSYxc1wuvLD4yMlpKZDQLHxa6Pn";

const TOP_ARTICLES_COUNT = 4;

function KnowledgeHub() {
  const { user } = useAppContext();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/article/get")
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.article);
          setArticles(res.data.article); // Only shows what's in your DB
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category);

  // Show top N articles if real articles exist
  const topArticles =
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <div className="flex justify-center py-5">
        <div className="flex flex-col max-w-7xl w-full px-2 sm:px-6 lg:px-8">
          {/* HEADER */}
          <header className="flex items-center justify-between border-b border-[#F5F5F5] py-4 px-2 sm:px-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-[#2E7D32]">
                <span className="material-symbols-outlined text-3xl">
                  agriculture
                </span>
                <h2 className="text-xl font-bold tracking-tight">
                  Krishisathi
                </h2>
              </div>
              <nav className="hidden md:flex items-center gap-9">
                <a href="#" className="text-[#212121] text-sm font-medium">
                  Home
                </a>
                <a href="#" className="text-[#2E7D32] font-bold text-sm">
                  Knowledge Hub
                </a>
                <a href="#" className="text-[#212121] text-sm font-medium">
                  Market Prices
                </a>
                <a href="#" className="text-[#212121] text-sm font-medium">
                  Weather
                </a>
              </nav>
            </div>
            <div className="flex flex-1 justify-end items-center gap-4">
              <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full items-stretch rounded-lg h-full">
                  <div className="flex items-center justify-center pl-3 rounded-l-lg bg-[#F5F5F5] text-gray-500 border-r-0">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input w-full min-w-0 flex-1 rounded-lg text-[#212121] bg-[#F5F5F5] h-full px-4 border-none placeholder:text-gray-500"
                    placeholder="Search articles..."
                  />
                </div>
              </label>
              {!user && (
                <Link
                  to={`/`}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#2E7D32] text-white text-sm font-bold transition-colors hover:bg-opacity-90">
                  Login
                </Link>
              )}
            </div>
          </header>
          {/* MAIN */}
          <main className="flex flex-col gap-10 py-7">
            {/* Hero */}
            <div className="flex flex-col gap-6 px-2 py-10 md:flex-row bg-[#F5F5F5] rounded-xl">
              <div
                className="w-full aspect-video bg-center bg-cover bg-no-repeat rounded-lg md:min-w-[400px]"
                style={{
                  backgroundImage: `url('${HERO_IMAGE}')`,
                }}
              />
              <div className="flex flex-col gap-6 px-4 justify-center md:min-w-[400px]">
                <div className="flex flex-col gap-2 text-left">
                  <h1 className="text-4xl font-black leading-tight">
                    New Government Subsidy Announced for Rabi Crops
                  </h1>
                  <h2 className="text-gray-600 text-base font-normal">
                    Learn how the latest government initiatives can benefit your
                    farming practices and increase your yield this season.
                  </h2>
                </div>
                <button className="flex self-start min-w-[84px] items-center justify-center rounded-lg h-10 px-5 bg-[#2E7D32] text-white text-base font-bold hover:bg-opacity-90 transition-colors">
                  Read More
                </button>
              </div>
            </div>
            {/* Category Chips */}
            <div className="flex flex-wrap gap-3 p-3 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className={`flex h-9 items-center gap-x-2 rounded-full pl-4 pr-4 cursor-pointer transition-colors ${
                    cat === category
                      ? "bg-[#2E7D32] text-white font-medium"
                      : "bg-[#F5F5F5] text-[#212121] hover:bg-gray-200"
                  }`}
                  onClick={() => setCategory(cat)}>
                  <p className="text-sm font-medium">{cat}</p>
                </div>
              ))}
            </div>
            {/* Grid Content */}
            <div className="flex flex-col md:flex-row gap-12">
              {/* Article grid */}
              <div className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {loading && (
                    <div className="col-span-3 text-center text-lg">
                      Loading articles...
                    </div>
                  )}
                  {!loading && filtered.length === 0 && (
                    <div className="col-span-3 text-center text-lg text-gray-400">
                      No articles found.
                    </div>
                  )}
                  {!loading &&
                    filtered.map((a) => (
                      <Link
                        key={a._id}
                        to={`/article/${a._id}`}
                        className="flex flex-col gap-3 pb-3 group cursor-pointer hover:shadow-lg transition">
                        <div className="w-full aspect-video bg-center bg-cover rounded-lg overflow-hidden">
                          <div
                            className="w-full h-full bg-center bg-cover group-hover:scale-105 transition-transform duration-300"
                            style={{
                              backgroundImage: `url('${a.coverImage}')`,
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-[#FB8C00] text-xs font-bold uppercase tracking-wider">
                            {a.category}
                          </p>
                          <p className="text-[#212121] text-base font-bold">
                            {a.title}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {(a.content || "").slice(0, 100)}
                            {a.content && a.content.length > 100 ? "..." : ""}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {a.author?.name || "Unknown Author"} •{" "}
                            {a.readTime || 5} min read
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
                {/* Pagination remains unchanged */}
                <div className="flex items-center justify-center p-4">
                  <a
                    href="#"
                    className="text-sm font-bold size-10 flex items-center justify-center text-white rounded-lg bg-[#2E7D32]">
                    1
                  </a>
                  <a
                    href="#"
                    className="size-10 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] text-[#212121]">
                    2
                  </a>
                  <span className="size-10 flex items-center justify-center text-[#212121] rounded-lg">
                    ...
                  </span>
                  <a
                    href="#"
                    className="size-10 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] text-[#212121]">
                    10
                  </a>
                </div>
              </div>
              {/* Sidebar */}
              <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
                <div className="sticky top-10 bg-[#F5F5F5] p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-6">Top Articles</h3>
                  <div className="flex flex-col gap-6">
                    {topArticles.length === 0 ? (
                      <span className="text-gray-400">No articles yet.</span>
                    ) : (
                      topArticles.map((a, idx) => (
                        <a
                          key={a.title}
                          href={`/article/${a._id}`}
                          className="group flex items-center gap-4">
                          <div className="text-4xl font-black text-gray-300 transition-colors group-hover:text-[#2E7D32]">
                            {`0${idx + 1}`}
                          </div>
                          <p className="text-sm font-medium text-[#212121] group-hover:text-[#2E7D32]">
                            {a.title}
                          </p>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeHub;
