// import axios from "axios";

// export const getWeather = async (req, res) => {
//   const { location } = req.params;
//   const apiKey = process.env.WEATHER_API_KEY;

//   if (!location) {
//     return res.status(400).json({
//       success: false,
//       message: "Location parameter is required",
//     });
//   }

//   if (!apiKey) {
//     return res.status(500).json({
//       success: false,
//       message: "Weather API key is not configured",
//     });
//   }

//   try {
//     const response = await axios.get(
//       `https://api.weatherapi.com/v1/current.json`,
//       {
//         params: {
//           key: apiKey,
//           q: location,
//           aqi: "no",
//         },
//       }
//     );

//     const data = response.data;

//     const weather = {
//       location: `${data.location.name}, ${data.location.country}`,
//       temperature: data.current.temp_c,
//       humidity: data.current.humidity,
//       condition: data.current.condition.text,
//       icon: data.current.condition.icon,
//       wind_speed: data.current.wind_kph,
//     };

//     res.status(200).json({ success: true, weather });
//   } catch (error) {
//     const statusCode = error.response?.status || 500;
//     const message =
//       error.response?.data?.error?.message || "Unable to fetch weather data";

//     res.status(statusCode).json({
//       success: false,
//       message,
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };
