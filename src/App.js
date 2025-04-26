import React, { useState, useEffect } from 'react';

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Tehran&units=metric&appid=6275bc00b989ce4c39aab6913db1733a')
      .then(response => response.json())
      .then(data => {
        setWeather({
          city: data.name,
          temp: data.main.temp,
          condition: data.weather[0].description,
        });
      })
      .catch(error => console.error('خطا در گرفتن اطلاعات آب و هوا:', error));
  }, []);

  if (!weather) return <div>در حال بارگذاری اطلاعات آب و هوا...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>آب و هوای {weather.city}</h1>
      <p>دمای فعلی: {weather.temp}° سانتی‌گراد</p>
      <p>وضعیت آسمان: {weather.condition}</p>
    </div>
  );
}

export default App;