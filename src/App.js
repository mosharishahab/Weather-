import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [error, setError] = useState(null);

  const getWeatherIcon = (condition, size = 24) => {
    switch (condition) {
      case 'Clear':
        return <Sun size={size} className="text-yellow-400" />;
      case 'Clouds':
        return <Cloud size={size} className="text-gray-400" />;
      case 'Rain':
        return <CloudRain size={size} className="text-blue-500" />;
      case 'Snow':
        return <CloudSnow size={size} className="text-blue-200" />;
      case 'Thunderstorm':
        return <CloudLightning size={size} className="text-yellow-600" />;
      case 'Mist':
      case 'Fog':
        return <CloudFog size={size} className="text-gray-300" />;
      default:
        return <Sun size={size} className="text-yellow-400" />;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            console.log('Weather API response:', data); // دیباگ دقیق
            if (data.cod === 200) {
              setCurrentWeather({
                city: data.name,
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                highTemp: Math.round(data.main.temp_max),
                lowTemp: Math.round(data.main.temp_min),
              });
            } else {
              setError('مشکل در دریافت اطلاعات آب و هوا');
            }
          })
          .catch(err => {
            console.error('Fetch error:', err);
            setError('مشکل در اتصال به سرور آب و هوا');
          });
      }, (err) => {
        console.error('Geolocation error:', err);
        setError('دسترسی به لوکیشن رد شد');
      });
    } else {
      setError('مرورگر شما از لوکیشن پشتیبانی نمی‌کند');
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="flex items-center justify-center h-screen">
        در حال بارگذاری اطلاعات آب و هوا...
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col h-full text-white bg-gradient-to-b from-blue-500 to-blue-700 p-6 rounded-xl overflow-hidden">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-light mb-1">{currentWeather.city}</h1>
        <div className="flex items-center justify-center mt-4">
          <span className="text-6xl font-thin">{currentWeather.temp}°</span>
          <div className="mx-4">
            {getWeatherIcon(currentWeather.condition, 48)}
          </div>
        </div>
        <p className="text-xl mt-2">{currentWeather.description}</p>
        <p className="text-lg">
          بیشینه: {currentWeather.highTemp}° | کمینه: {currentWeather.lowTemp}°
        </p>
      </div>
    </div>
  );
};

export default App;