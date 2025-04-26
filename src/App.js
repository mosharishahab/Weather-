import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, CloudFog } from 'lucide-react';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [funnyQuote, setFunnyQuote] = useState('');
  const [isDayTime, setIsDayTime] = useState(true);
  const [loading, setLoading] = useState(true); // برای لودینگ واقعی

  const funnyQuotes = {
    Clear: [
      "آفتاب کله پاچمون کرده!",
      "کرم ضدآفتاب یادت نره، سیخ نشی!",
      "آفتاب درخشانه، مواظب سوختن باش!",
      "هوا خوبه، وقتشه عشق و حال کنی!"
    ],
    Clouds: [
      "ابرها دارن شایعه درست میکنن!",
      "هوا ابریه، دلت باز باشه!",
      "ابرها ناراحتن، ولی ما نه!",
      "یه کم دیگه شاید بارون شد!"
    ],
    "نیمه ابری": [
      "خورشید قایم باشک بازی کرده!",
      "یه کم آفتاب، یه کم ابر، یه دل نه صد دل!",
      "نیمه ابری یعنی هوا دو دله!",
      "ابرها و خورشید صلح کردن امروز!"
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
    const now = new Date();
    const hour = now.getHours();
    setIsDayTime(hour >= 6 && hour < 20); // روشن از ۶ تا ۲۰

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
              sunrise,
              sunset,
              time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' })
            });

            const condition = data.weather[0].main;
            let quotes = funnyQuotes[condition] || funnyQuotes["Clear"];
            setFunnyQuote(quotes[Math.floor(Math.random() * quotes.length)]);

            setLoading(false); // دیتا کامل شد، لودینگ خاموش
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 p-4 text-white" style={{ minHeight: '100vh' }}>
        <div className="animate-spin-slow mb-4">
          <Sun size={80} className="text-yellow-400" />
        </div>
        <p className="text-2xl">دارم هوا رو برات چک می‌کنم...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className={`flex flex-col min-h-screen text-white p-4 rounded-xl overflow-auto transition-all duration-1000 ${isDayTime ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-gray-800 to-gray-900'} fade-in`}>
      
      {/* بقیه صفحه اصلی */}
      {/* (شامل نام شهر، دما، رطوبت، طلوع غروب، پیش‌بینی ساعتی، ۵ روزه، جمله خنده‌دار و کپی‌رایت) */}
      
      {/* همین‌ها همونجوری که قبلاً چیدیم میاد */}
      
    </div>
  );
};

export default App;