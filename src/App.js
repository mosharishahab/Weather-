import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({
    city: 'تهران',
    temp: 22,
    condition: 'آفتابی',
    highTemp: 25,
    lowTemp: 18,
    time: '14:30',
    date: 'شنبه، ۷ اردیبهشت'
  });

  const [hourlyForecast, setHourlyForecast] = useState([
    { time: 'الان', temp: 22, condition: 'آفتابی' },
    { time: '15', temp: 24, condition: 'آفتابی' },
    { time: '16', temp: 24, condition: 'نیمه ابری' },
    { time: '17', temp: 23, condition: 'نیمه ابری' },
    { time: '18', temp: 21, condition: 'نیمه ابری' },
    { time: '19', temp: 20, condition: 'ابری' },
    { time: '20', temp: 19, condition: 'ابری' },
    { time: '21', temp: 19, condition: 'ابری' },
    { time: '22', temp: 18, condition: 'ابری' }
  ]);

  const [dailyForecast, setDailyForecast] = useState([
    { day: 'امروز', highTemp: 25, lowTemp: 18, condition: 'آفتابی' },
    { day: 'یکشنبه', highTemp: 28, lowTemp: 19, condition: 'آفتابی' },
    { day: 'دوشنبه', highTemp: 30, lowTemp: 20, condition: 'آفتابی' },
    { day: 'سه‌شنبه', highTemp: 29, lowTemp: 20, condition: 'نیمه ابری' },
    { day: 'چهارشنبه', highTemp: 27, lowTemp: 19, condition: 'ابری' }
  ]);

  const [extraInfo, setExtraInfo] = useState({
    uvIndex: '۵ (متوسط)',
    sunrise: '۶:۱۲',
    sunset: '۱۹:۴۵',
    precipitation: '۰٪',
    humidity: '۳۵٪',
    wind: '۸ کیلومتر/ساعت',
    feelsLike: '۲۳°',
    visibility: '۱۰ کیلومتر',
    pressure: '۱۰۱۳ هکتوپاسکال'
  });

  const getWeatherIcon = (condition, size = 24) => {
    switch (condition) {
      case 'آفتابی':
      case 'Clear':
        return <Sun size={size} className="text-yellow-400" />;
      case 'ابری':
      case 'Clouds':
        return <Cloud size={size} className="text-gray-400" />;
      case 'نیمه ابری':
        return <Cloud size={size} className="text-blue-300" />;
      case 'بارانی':
      case 'Rain':
        return <CloudRain size={size} className="text-blue-500" />;
      case 'برفی':
      case 'Snow':
        return <CloudSnow size={size} className="text-blue-200" />;
      case 'طوفانی':
      case 'Thunderstorm':
        return <Wind size={size} className="text-blue-700" />;
      case 'مه آلود':
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

        // گرفتن آب و هوای فعلی
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            setCurrentWeather(prev => ({
              ...prev,
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              highTemp: Math.round(data.main.temp_max),
              lowTemp: Math.round(data.main.temp_min),
              time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })
            }));
          });

        // گرفتن اسم شهر اصلی با reverse geocoding
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fa`)
          .then(response => response.json())
          .then(locationData => {
            setCurrentWeather(prev => ({
              ...prev,
              city: locationData.city || locationData.locality || prev.city
            }));
          });

        // گرفتن پیش‌بینی ۵ روزه
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            const dailyData = {};
            data.list.forEach(item => {
              const date = item.dt_txt.split(' ')[0];
              if (!dailyData[date]) {
                dailyData[date] = {
                  temp_min: item.main.temp_min,
                  temp_max: item.main.temp_max,
                  condition: item.weather[0].main
                };
              } else {
                dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
                dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
              }
            });

            const dailyArray = Object.keys(dailyData).slice(0, 5).map((date, index) => {
              const options = { weekday: 'long' };
              const dayName = new Date(date).toLocaleDateString('fa-IR', options);
              return {
                day: index === 0 ? 'امروز' : dayName,
                highTemp: Math.round(dailyData[date].temp_max),
                lowTemp: Math.round(dailyData[date].temp_min),
                condition: dailyData[date].condition
              };
            });

            setDailyForecast(dailyArray);
          });

      }, (err) => {
        console.error('Geolocation error:', err);
      });
    }
  }, []);

  return (
    <div dir="rtl" className="flex flex-col h-full text-white bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-xl overflow-hidden">
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

      {/* Hourly Forecast */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
        <h2 className="text-lg mb-4">پیش‌بینی ساعتی</h2>
        <div className="flex overflow-x-auto pb-2">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="flex flex-col items-center mx-3 min-w-16">
              <p className="mb-1">{hour.time}</p>
              <div className="my-2">
                {getWeatherIcon(hour.condition)}
              </div>
              <p>{hour.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
        <h2 className="text-lg mb-2">پیش‌بینی ۵ روزه</h2>
        {dailyForecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-white border-opacity-20">
            <span className="w-24">{day.day}</span>
            <div className="flex mx-2">
              {getWeatherIcon(day.condition)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80 w-8 text-center">{day.lowTemp}°</span>
              <div className="w-24 bg-white bg-opacity-30 h-1 rounded-full">
                <div className="bg-white h-1 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="w-8 text-center">{day.highTemp}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(extraInfo).map(([key, value], index) => (
          <div key={index} className="bg-white bg-opacity-20 rounded-xl p-3">
            <p className="text-sm mb-1 opacity-80">{key}</p>
            <p className="text-lg">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;