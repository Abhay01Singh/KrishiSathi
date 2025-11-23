import React from "react";

const CropRecommendCard = ({ cropName }) => {
  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-green-100 border-2 border-green-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center">
      <div className="mb-3 flex items-center justify-center">
        <span className="text-3xl">🌱</span>
      </div>
      <h3 className="font-bold text-xl text-green-800 mb-1 tracking-wide">
        {cropName}
      </h3>
      <span className="text-xs text-green-600 bg-green-50 py-1 px-3 rounded-full mt-2 shadow-sm">
        Suggested Crop
      </span>
    </div>
  );
};

export default CropRecommendCard;
