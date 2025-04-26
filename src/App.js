import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [funnyQuote, setFunnyQuote] = useState('');

  const funnyQuotes = {
    Clear: [
      "آفتاب کله پاچمون کرده!",
      "کرم ضدآفتاب یادت نره، سیخ نشی!",
      "آفتاب درخشانه، مواظب سوختن باش!",
      "هوا عالیه، وقتشه عشق کنی!"
    ],
    Clouds: [
      "ابرها دارن نق میزنن!",
      "هوا ابریه، ولی دل ما صافه!",
      "ابرها خسته شدن، ما نه!",
      "نکنه بارون بزنه؟"
    ],
    "نیمه ابری": [
      "خورشید قایم باشک بازی میکنه!",
      "یه کم ابر، یه کم آفتاب، قشنگه!",
      "هوا نیمه دلبره امروز!",
      "آسمون امروز دودله!"
    ]
  };

  const getWeatherIcon = (condition, size = 48, isMain = false) => {
    const extraClass = isMain
      ? condition === 'Clear' || condition === 'آفتابی'
        ? 'animated-sun-main'
        : 'animated-cloud'
      : '';
    switch (condition) {
      case 'Clear':
      case 'آفتابی':
        return <Sun size={size} className={`text-yellow-400 ${extraClass}`} />;
      case 'Clouds':
      case 'ابری':
      case 'نیمه ابری':
        return <Cloud size={size} className={`text-gray-400 ${extraClass}`} />;
      case 'Rain':
      case 'بارانی':
        return <CloudRain size={size} className="text-blue-400" />;
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
        return <Sun size={size} className={`text-yellow-400 ${extraClass}`} />;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const locationData = await locationRes.json();
        const cityName = locationData.address.city || locationData.address.town || locationData.address.village || 'شهر نامشخص';

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`);
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`);
        const forecastData = await forecastRes.json();

        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

        setCurrentWeather({
          city: cityName,
          temp: Math.round(weatherData.main.temp),
          condition: weatherData.weather[0].description,
          mainCondition: weatherData.weather[0].main,
          humidity: weatherData.main.humidity,
          sunrise,
          sunset
        });

        const conditionKey = weatherData.weather[0].main;
        const quotes = funnyQuotes[conditionKey] || funnyQuotes['Clear'];
        setFunnyQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        const hourly = forecastData.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main
        }));
        setHourlyForecast(hourly);

        const dailyData = {};
        forecastData.list.forEach(item => {
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
          const dayName = new Date(date).toLocaleDateString('fa-IR', { weekday: 'long' });
          return {
            day: index === 0 ? 'امروز' : dayName,
            highTemp: Math.round(dailyData[date].temp_max),
            lowTemp: Math.round(dailyData[date].temp_min),
            condition: dailyData[date].condition
          };
        });
        setDailyForecast(dailyArray);

      }, (error) => {
        console.error('خطای مکان‌یابی:', error);
      });
    }
  }, []);

  if (!currentWeather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <Sun size={64} className="animate-spin text-yellow-400 mb-4" />
        <p className="text-2xl font-bold">در حال چک کردن هوا...</p>
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const isDay = currentHour >= 6 && currentHour <= 20;

  return (
    <div dir="rtl" className={`flex flex-col min-h-screen ${isDay ? 'bg-gradient-to-b from-blue-400 to-blue-700' : 'bg-gradient-to-b from-gray-800 to-gray-900'} text-white p-4 overflow-auto`}>

      {/* بالا */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{currentWeather.city}</h1>
        <p className="text-lg mb-4">{new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <div className="flex justify-center items-center gap-4">
          {getWeatherIcon(currentWeather.mainCondition, 64, true)}
          <span className="text-6xl">{currentWeather.temp}°</span>
        </div>
        <p className="text-xl mt-4">{currentWeather.condition}</p>
        <p className="text-lg mt-2">%{currentWeather.humidity} رطوبت</p>
      </div>

      {/* اطلاعات طلوع و غروب */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <p className="text-sm mb-2">طلوع خورشید</p>
          <p className="text-lg">{currentWeather.sunrise}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <p className="text-sm mb-2">غروب خورشید</p>
          <p className="text-lg">{currentWeather.sunset}</p>
        </div>
      </div>

      {/* پیش‌بینی ساعتی */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
        <h2 className="text-lg mb-4">پیش‌بینی ساعتی</h2>
        <div className="flex overflow-x-auto gap-4">
          {hourlyForecast.map((hour, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <p className="text-sm">{hour.time}</p>
              {getWeatherIcon(hour.condition)}
              <p>{hour.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* پیش‌بینی ۵ روزه */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
        <h2 className="text-lg mb-4">پیش‌بینی ۵ روزه</h2>
        {dailyForecast.map((day, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b border-white border-opacity-30">
            <span>{day.day}</span>
            <span className="flex gap-2 items-center">
              {getWeatherIcon(day.condition)}
              <span>{day.lowTemp}° / {day.highTemp}°</span>
            </span>
          </div>
        ))}
      </div>

      {/* جمله خنده دار */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center text-lg font-semibold mb-8">
        {funnyQuote}
      </div>

      {/* کپی‌رایت */}
      <div className="text-center text-xs opacity-50 mb-4">
        <a href="mailto:shahab.aix1@gmail.com" className="no-underline">© 2025 Shahab - با عشق ساختمش</a>
      </div>

    </div>
  );
};

export default App;