// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const cityName = locationRes.data.city || locationRes.data.locality;
        setCity(cityName);
        fetchWeather(cityName);
      },
      (err) => console.log(err)
    );
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const apiKey = '837a0e00ed8f2f2c5b9585bbc868f9e2'; // Replace with your key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Weather fetch error:", error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeather(city);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br

     from-orange-400 via-pink-500 to-red-600

       flex items-center justify-center"
    >
      <div className="bg-white/20 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-md">Weather Forecast</h1>
        <form onSubmit={handleSubmit} className="mb-4 flex">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
            placeholder="Enter city..."
            className="flex-1 px-4 py-2 rounded-l-md text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-md transition duration-300"
          >
            Search
          </button>
        </form>

        {/* Spinner while loading */}
        {loading && (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-4 border-white border-dashed rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        )}

        {!loading && weatherData && (
          <div className="mt-6 text-center space-y-2">
            <h2 className="text-2xl font-semibold">{weatherData.name}, {weatherData.sys.country}</h2>
            <p className="text-lg">{weatherData.weather[0].description}</p>
            <p className="text-5xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
            <img
  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
  alt={weatherData.weather[0].description}
  className="mx-auto"
/>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>Humidity: {weatherData.main.humidity}%</div>
              <div>Wind: {weatherData.wind.speed} m/s</div>
              <div>Feels Like: {Math.round(weatherData.main.feels_like)}°C</div>
              <div>Pressure: {weatherData.main.pressure} hPa</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
