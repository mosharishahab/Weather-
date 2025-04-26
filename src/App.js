import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({
    city: 'تهران',
    temp: 22,
    condition: 'آفتابی',
    highTemp: 25,
    lowTemp: 18,
    humidity: 35,
    sunrise: '06:00',
    sunset: '19:45',
    time: '14:30',
    date: 'شنبه، ۷ اردیبهشت'
  });

  const getWeatherIcon = (condition, size = 24) => {
    switch (condition) {
      case 'Clear':
      case 'آفتابی':
        return <Sun size={size} className="text-yellow-400" />;
      case 'Clouds':
      case 'ابری':
      case 'نیمه ابری':
        return <Cloud size={size} className="text-gray-400" />;
      case 'Rain':
      case 'بارانی':
        return <CloudRain size={size} className="text-blue-500" />;
      case 'Snow':
      case 'برفی':
        return <CloudSnow size={size} className="text-blue-200" />;
      case 'Thunderstorm':
      case 'طوفانی':
        return <Wind size={size} className="text-blue-700" />;
      case 'Mist':
      case 'Fog':
      case 'مه آلود':
        return <CloudFog size={size} className="text-gray-300" />;
      default:
        return <Sun size={size} className="text-yellow-400" />;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        // گرفتن اطلاعات آب و هوا
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

            setCurrentWeather(prev => ({
              ...prev,
              city: data.name,
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              highTemp: Math.round(data.main.temp_max),
              lowTemp: Math.round(data.main.temp_min),
              humidity: data.main.humidity,
              sunrise: sunrise,
              sunset: sunset,
              time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })
            }));
          });

      }, (err) => {
        console.error('Geolocation error:', err);
      });
    }
  }, []);

  return (
    <div dir="rtl" className="flex flex-col h-full text-white bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-xl overflow-hidden animated-background">
      {/* Header */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-light mb-1">{currentWeather.city}</h1>
        <p className="text-xl opacity-90">{currentWeather.date}</p>
        <div className="flex items-center justify-center mt-4">
          <span className="text-6xl font-thin">{currentWeather.temp}°</span>
          <div className="mx-4">
            {getWeatherIcon(currentWeather.condition, 48)}
          </div>
        </div>
        <p className="text-xl mt-2">{currentWeather.condition}</p>
        <p className="text-lg">
          بیشترین: {currentWeather.highTemp}° | کمترین: {currentWeather.lowTemp}°
        </p>
      </div>

      {/* Extra Info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">رطوبت</p>
          <p className="text-lg">{currentWeather.humidity}%</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">طلوع خورشید</p>
          <p className="text-lg">{currentWeather.sunrise}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">غروب خورشید</p>
          <p className="text-lg">{currentWeather.sunset}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">ساعت فعلی</p>
          <p className="text-lg">{currentWeather.time}</p>
        </div>
      </div>
    </div>
  );
};

export default App;