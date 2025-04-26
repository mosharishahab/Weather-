import React, { useState, useEffect } from 'react';
import { Sun, Cloud } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const locationData = await locationRes.json();
        const cityName =
          locationData.address.city ||
          locationData.address.town ||
          locationData.address.village ||
          'شهر نامشخص';

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`);
        const data = await res.json();

        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

        setCurrentWeather({
          city: cityName,
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          sunrise,
          sunset,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })
        });
      });
    }
  };

  useEffect(() => {
    fetchWeather();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // لودینگ ۱ ثانیه

    return () => clearTimeout(timer);
  }, []);

  if (loading || !currentWeather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <Sun size={80} className="animate-spin-slow text-yellow-400 mb-6" />
        <p className="text-2xl font-bold">در حال چک کردن هوا...</p>
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour < 6;

  return (
    <div dir="rtl" className={`flex flex-col min-h-screen text-white p-4 overflow-auto ${isNight ? 'bg-gradient-to-b from-gray-900 to-blue-900' : 'bg-gradient-to-b from-blue-500 to-blue-700'}`}>

      {/* اطلاعات آب و هوا */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-light mb-1">{currentWeather.city}</h1>
        <p className="text-xl opacity-90">{currentWeather.date}</p>
        <div className="flex items-center justify-center mt-4">
          <span className="text-6xl font-thin">{currentWeather.temp}°</span>
        </div>
        <p className="text-xl mt-2">{currentWeather.condition}</p>
        <p className="text-lg mt-1">رطوبت: {currentWeather.humidity}%</p>
      </div>

      {/* طلوع و غروب */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">طلوع خورشید</p>
          <p className="text-lg">{currentWeather.sunrise}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">غروب خورشید</p>
          <p className="text-lg">{currentWeather.sunset}</p>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="text-center text-white text-xs opacity-50 mt-10">
        <a href="mailto:shahab.aix1@gmail.com" className="no-underline">
          © 2025 Shahab - با عشق ساختمش
        </a>
      </div>
    </div>
  );
};

export default App;