import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [hourlyForecast, setHourlyForecast] = useState([]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
      case 'آفتابی':
        return <Sun size={32} className="text-yellow-400" />;
      case 'Clouds':
      case 'ابری':
        return <Cloud size={32} className="text-gray-400" />;
      case 'Rain':
      case 'بارانی':
        return <CloudRain size={32} className="text-blue-500" />;
      case 'Snow':
      case 'برفی':
        return <CloudSnow size={32} className="text-blue-200" />;
      case 'Thunderstorm':
      case 'طوفانی':
        return <Wind size={32} className="text-blue-700" />;
      case 'Mist':
      case 'Fog':
      case 'مه آلود':
        return <CloudFog size={32} className="text-gray-300" />;
      default:
        return <Sun size={32} className="text-yellow-400" />;
    }
  };

  useEffect(() => {
    // اینجا میتونی بعداً دیتا از API بگیری
    // فعلا تستی داده میذارم
    setHourlyForecast([
      { time: 'الان', temp: 22, condition: 'Clear' },
      { time: '15', temp: 24, condition: 'Clear' },
      { time: '16', temp: 23, condition: 'Clouds' },
      { time: '17', temp: 21, condition: 'Rain' },
      { time: '18', temp: 20, condition: 'Clouds' },
      { time: '19', temp: 19, condition: 'Clear' },
      { time: '20', temp: 18, condition: 'Clouds' }
    ]);
  }, []);

  return (
    <div className="container mt-2">
      <h1 className="text-2xl mb-4 text-center">پیش‌بینی ساعتی</h1>

      <div className="hourly-forecast">
        {hourlyForecast.map((hour, idx) => (
          <div key={idx} className="forecast-hour">
            <p className="text-sm mb-1">{hour.time}</p>
            {getWeatherIcon(hour.condition)}
            <p className="mt-1">{hour.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;