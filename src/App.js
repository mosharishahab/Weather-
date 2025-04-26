import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Moon, Wind, CloudLightning, CloudFog } from 'lucide-react';

const WeatherApp = () => {
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
    { day: 'چهارشنبه', highTemp: 27, lowTemp: 19, condition: 'ابری' },
    { day: 'پنج‌شنبه', highTemp: 26, lowTemp: 18, condition: 'بارانی' },
    { day: 'جمعه', highTemp: 25, lowTemp: 17, condition: 'نیمه ابری' }
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
        return <Sun size={size} className="text-yellow-400" />;
      case 'ابری':
        return <Cloud size={size} className="text-gray-400" />;
      case 'نیمه ابری':
        return <Cloud size={size} className="text-blue-300" />;
      case 'بارانی':
        return <CloudRain size={size} className="text-blue-500" />;
      case 'برفی':
        return <CloudSnow size={size} className="text-blue-200" />;
      case 'طوفانی':
        return <Wind size={size} className="text-blue-700" />;
      case 'رعد و برق':
        return <CloudLightning size={size} className="text-yellow-600" />;
      case 'مه آلود':
        return <CloudFog size={size} className="text-gray-300" />;
      default:
        return <Sun size={size} className="text-yellow-400" />;
    }
  };

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
        <h2 className="text-lg mb-2">پیش‌بینی ۱۰ روزه</h2>
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
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">شاخص UV</p>
          <p className="text-lg">{extraInfo.uvIndex}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">طلوع خورشید</p>
          <p className="text-lg">{extraInfo.sunrise}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">احتمال بارش</p>
          <p className="text-lg">{extraInfo.precipitation}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">رطوبت</p>
          <p className="text-lg">{extraInfo.humidity}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">سرعت باد</p>
          <p className="text-lg">{extraInfo.wind}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <p className="text-sm mb-1 opacity-80">احساس دما</p>
          <p className="text-lg">{extraInfo.feelsLike}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
