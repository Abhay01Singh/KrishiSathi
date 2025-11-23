import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const { axios } = useAppContext();

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);
      const { data } = await axios.get(`/api/weather/${location}`);
      if (data.success) {
        setWeather(data.weather);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-4">
          🌦️ Weather App
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter city or country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          />
          <button
            onClick={fetchWeather}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-md transition duration-200">
            Get Weather
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {weather && (
          <div className="mt-6 bg-green-50 p-6 rounded-2xl shadow-md border border-green-200 transition hover:shadow-lg hover:border-green-300">
            <h3 className="text-2xl font-semibold mb-2 text-green-800 text-center">
              {weather.location}
            </h3>
            <div className="flex flex-col items-center space-y-3">
              <img
                src={weather.icon}
                alt="weather icon"
                className="w-16 h-16"
              />
              <p className="text-xl font-bold text-green-700">
                {weather.temperature} °C
              </p>
              <p className="text-md text-green-600">
                Humidity: {weather.humidity}%
              </p>
              <p className="text-md text-green-600">
                Condition: {weather.condition}
              </p>
              <p className="text-md text-green-600">
                Wind Speed: {weather.wind_speed} kph
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
