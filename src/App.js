import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({
    city: '',
    temp: 0,
    condition: '',
    highTemp: 0,
    lowTemp: 0,
    humidity: 0,
    sunrise: '',
    sunset: '',
    time: '',
    date: ''
  });

  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [funnyQuote, setFunnyQuote] = useState('');

  const funnyQuotes = {
    Clear: [
      "آفتاب پدرسوخته اوف داره برنزه‌ می‌کنه!",
      "کرم ضدآفتاب یادت نره، لبو نشی!",
      "آفتاب درخشانه، مواظب پوستت باش!",
      "هوا خوبه، ولی مواظب باش نسوزی!"
    ],
    Clouds: [
      "ابرها دارن شایعه پراکنی می‌کنن!",
      "هوا ابریه، دل ابرها گرفته!",
      "ابرها دپرس شدن، تو نشی!",
      "یه کم دیگه میشه بارونی!"
    ],
    "نیمه ابری": [
      "خورشید قایم‌موشک بازی میکنه!",
      "یه ذره ابر، یه ذره آفتاب، همه چی قاطی پاتی!",
      "نیمه ابری یعنی آسمون دو دله!",
      "ابرها و خورشید داوش شدن امروز!"
    ]
  };

  const getWeatherIcon = (condition, size = 24, isMain = false) => {
    const extraClass = isMain
      ? condition === 'Clear' || condition === 'آفتابی'
        ? 'animated-sun'
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
        return <Sun size={size} className={`text-yellow-400 ${extraClass}`} />;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;

        const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const locationData = await locationRes.json();

        const cityName = locationData.address.city || locationData.address.town || locationData.address.village || 'شهر نامشخص';

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

            setCurrentWeather({
              city: cityName,
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              highTemp: Math.round(data.main.temp_max),
              lowTemp: Math.round(data.main.temp_min),
              humidity: data.main.humidity,
              sunrise: sunrise,
              sunset: sunset,
              time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })
            });

            const condition = data.weather[0].main;
            let quotes = funnyQuotes[condition] || funnyQuotes["Clear"];
            setFunnyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
          });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=fa&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
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
          });

      }, (err) => {
        console.error('Geolocation error:', err);
      });
    }
  }, []);

  if (!currentWeather.city) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 p-4 text-white">
        <p className="text-2xl mb-4 animate-pulse">در حال دریافت اطلاعات...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col min-h-screen text-white bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-xl overflow-auto animated-background">
      
      {/* محتوای هواشناسی و پیش‌بینی‌ها */}

      {/* کادر جمله خنده دار */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-10 text-center text-white text-lg font-semibold">
        {funnyQuote}
      </div>

      {/* کادر امضای پایینی */}
      <div className="text-center text-white text-xs opacity-50 mb-4">
        © 2025 Shahab - با عشق ساختمش
      </div>

    </div>
  );
};

export default App;