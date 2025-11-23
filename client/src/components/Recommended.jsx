import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import CropRecommendCard from "./CropRecommendCard";

const RecommendCard = () => {
  const { recommended, getRecommendation, navigate } = useAppContext();

  useEffect(() => {
    getRecommendation();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-green-800 mb-2 flex items-center gap-2">
          <span role="img" aria-label="Crop">
            🌾
          </span>{" "}
          Recommended Crops for You
        </h2>
        <p className="text-lg text-green-700 mb-7 font-medium">
          Get personalized crop suggestions based on your land's specifics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommended && recommended.length > 0 ? (
            recommended.map((crop, i) => (
              <div
                key={i}
                className="transform transition duration-300 hover:scale-105">
                <CropRecommendCard cropName={crop} />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center">
                <span className="text-5xl mb-2 text-green-200">🌱</span>
                <p className="text-gray-600 text-lg mb-2">
                  No recommendations found.
                </p>
                <p className="text-gray-400 text-base">
                  Please add your land details to get personalized crop
                  suggestions.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/add-land")}
            className="bg-green-600 hover:bg-green-700 transition shadow-lg hover:shadow-xl text-white text-lg font-semibold py-3 px-8 rounded-full flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-green-200">
            <span className="text-2xl">➕</span>
            Add or Update Land Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendCard;
