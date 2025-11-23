import mongoose from "mongoose";
const AdvisorySchema = new mongoose.Schema({
  location: String,

  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  rainfall: Number,

  recommendations: [
    {
      type: { type: String },
      message: String,
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("WeatherAdvisory", AdvisorySchema);
