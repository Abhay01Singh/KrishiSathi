// Simple rule-based crop recommendation logic
// Later, this can be replaced by an AI/ML model

import Land from "../models/Land.js";

export const recommendCrops = async (userId) => {
  const crops = [];

  const land = await Land.findOne({ userId });

  // 🌱 Soil Type Based Rules
  if (land.soilType.toLowerCase() === "clay") {
    if (land.rainfall > 800 && land.temperature < 35) {
      crops.push("Rice", "Sugarcane", "Jute");
    } else {
      crops.push("Wheat", "Barley");
    }
  } else if (land.soilType.toLowerCase() === "loamy") {
    if (land.rainfall > 700 && land.temperature < 30) {
      crops.push("Wheat", "Maize", "Pulses", "Cotton");
    } else {
      crops.push("Sunflower", "Mustard");
    }
  } else if (land.soilType.toLowerCase() === "sandy") {
    if (land.temperature > 25) {
      crops.push("Groundnut", "Bajra", "Millet");
    } else {
      crops.push("Cucumber", "Watermelon");
    }
  } else if (land.soilType.toLowerCase() === "black") {
    crops.push("Cotton", "Soybean", "Sorghum");
  } else if (land.soilType.toLowerCase() === "red") {
    crops.push("Maize", "Millets", "Peanut", "Pulses");
  } else {
    crops.push("Please consult an agricultural expert for better results.");
  }

  // 🌤️ Weather Adjustments
  if (land.temperature > 35) {
    crops.push("Avoid heat-sensitive crops like Wheat.");
  }

  if (land.rainfall < 500) {
    crops.push("Consider drought-resistant crops like Bajra, Jowar.");
  }

  // 🌾 Remove duplicates before returning
  return [...new Set(crops)];
};
