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

      {/* بالای صفحه */}
      <div className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-light mb-1">{currentWeather.city}</h1>
        <p className="text-xl opacity-90">{currentWeather.date}</p>
        <div className="flex items-center justify-center mt-4">
          <span className="text-6xl font-thin">{currentWeather.temp}°</span>
          <div className="mx-4">
            {getWeatherIcon(currentWeather.condition, 48, true)}
          </div>
        </div>
        <p className="text-xl mt-2">{currentWeather.condition}</p>
        <p className="text-lg">
          بیشترین: {currentWeather.highTemp}° | کمترین: {currentWeather.lowTemp}°
        </p>
      </div>

      {/* اطلاعات رطوبت، طلوع، غروب */}
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

      {/* پیش‌بینی ساعتی */}
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

      {/* پیش‌بینی ۵ روزه */}
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

      {/* کادر نوشته خنده دار */}
      <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-10 text-center text-white text-lg font-semibold">
        {funnyQuote}
      </div>

      {/* کپی رایت لینک دار */}
      <div className="text-center text-white text-xs opacity-50 mb-6">
        <a href="mailto:shahab.aix1@gmail.com" className="no-underline">
          © 2025 Shahab - با عشق ساختمش
        </a>
      </div>

    </div>
  );
};

export default App;