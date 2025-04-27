import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [funnyQuote, setFunnyQuote] = useState('');
  const [loading, setLoading] = useState(true);

  const funnyQuotes = {
    Clear: ["آفتاب سوراخمون کرده!", "کرم ضدآفتاب یادت نره!", "هوا خوبه وا،وقت عشق و حال !"],
    Clouds: ["ابرها دارن غر میزنن!", "هوا ابریه، حواستو جمع کن!", "شاید بارون بیاد!"],
    Rain: ["بارون داره میاد، چتر یادت نره!", "تر نشی‌ها!"],
  };

const getWeatherIcon = (condition, isMain = false) => {
  const extraClass = isMain ? "animated-sun" : "";
  switch (condition) {
    case 'Clear':
    case 'آفتابی':
      return <Sun size={55} className={`text-yellow-400 ${extraClass}`} />;
    case 'Clouds':
    case 'ابری':
      return <Cloud size={40} className="text-gray-400" />;
    case 'Rain':
    case 'بارانی':
      return <CloudRain size={40} className="text-blue-400" />;
    case 'Snow':
      return <CloudSnow size={40} className="text-blue-200" />;
    case 'Thunderstorm':
      return <Wind size={40} className="text-blue-700" />;
    case 'Mist':
    case 'Fog':
      return <CloudFog size={40} className="text-gray-300" />;
    default:
      return <Sun size={40} className="text-yellow-400" />;
  }
};

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const locationData = await locationRes.json();
        const cityName = locationData.address.city || locationData.address.town || locationData.address.village || 'شهر نامشخص';

        let persianCityName = cityName;
        if (cityName === 'Tehran') persianCityName = 'تهران';
        if (cityName === 'Karaj') persianCityName = 'کرج';
        if (cityName === 'Mashhad') persianCityName = 'مشهد';
        if (cityName === 'Shiraz') persianCityName = 'شیراز';
        // شهرهای دیگه هم میتونی اضافه کنی

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(res => res.json())
          .then(data => {
            setCurrentWeather({
              city: persianCityName,
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              highTemp: Math.round(data.main.temp_max),
              lowTemp: Math.round(data.main.temp_min),
              humidity: data.main.humidity,
              sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })
            });

            const cond = data.weather[0].main;
            const quotes = funnyQuotes[cond] || funnyQuotes['Clear'];
            setFunnyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
          });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(res => res.json())
          .then(data => {
            const hourly = data.list.slice(0, 8).map(item => ({
              time: new Date(item.dt * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main
            }));
            setHourlyForecast(hourly);

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

            const dailyArray = Object.keys(dailyData).slice(0, 5).map((date, idx) => {
              const dayName = new Date(date).toLocaleDateString('fa-IR', { weekday: 'long' });
              return {
                day: idx === 0 ? 'امروز' : dayName,
                highTemp: Math.round(dailyData[date].temp_max),
                lowTemp: Math.round(dailyData[date].temp_min),
                condition: dailyData[date].condition
              };
            });

            setDailyForecast(dailyArray);

            setTimeout(() => {
              setLoading(false);
            }, 1000); // لودینگ حداقل ۱ ثانیه بمونه
          });
      });
    }
  }, []);

  if (loading || !currentWeather) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white text-black">
        <Sun className="animated-sun mb-4" size={80} />
        <p className="text-2xl font-bold">هوای دلم بی تو ابریه</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col min-h-screen text-black p-4 overflow-auto">
      {/* اطلاعات اصلی */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light">{currentWeather.city}</h1>
        <p className="text-lg opacity-80">{currentWeather.date}</p>
        <div className="flex justify-center items-center mt-4">
          <span className="text-6xl font-bold">{currentWeather.temp}°</span>
          <div className="mx-3">{getWeatherIcon(currentWeather.condition)}</div>
        </div>
        <p className="text-xl mt-2">{currentWeather.condition}</p>
        <p className="text-sm mt-1">
          بیشترین: {currentWeather.highTemp}° | کمترین: {currentWeather.lowTemp}°
        </p>
      </div>

      {/* پیش‌بینی ساعتی */}
      <div className="flex overflow-x-auto gap-4 p-4">
        {hourlyForecast.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[70px]">
            <p className="text-sm mb-1">{hour.time}</p>
            {getWeatherIcon(hour.condition)}
            <p className="text-sm mt-1">{hour.temp}°</p>
          </div>
        ))}
      </div>

      {/* پیش‌بینی روزانه */}
      <div className="mt-6 space-y-4">
        {dailyForecast.map((day, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
            <span>{day.day}</span>
            {getWeatherIcon(day.condition)}
            <span>{day.lowTemp}° ↓ / {day.highTemp}° ↑</span>
          </div>
        ))}
      </div>

      {/* جمله خنده‌دار */}
      <div className="text-center text-sm mt-8 text-gray-600">
        {funnyQuote}
      </div>

      {/* کپی رایت پایین صفحه */}
      <div className="text-center text-xs opacity-50 mt-10 mb-2">
        <a href="mailto:shahab.aix1@gmail.com" className="no-underline">
          © 2025 Shahab - با عشق ساختمش
        </a>
      </div>
    </div>
  );
};

export default App;