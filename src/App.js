import React, { useState, useEffect } from 'react';

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            if (data && Number(data.cod) === 200) {
              setWeather({
                city: data.name,
                temp: data.main.temp,
                condition: data.weather[0].description,
              });
            } else {
              setError('مشکل در دریافت اطلاعات آب و هوا');
            }
          })
          .catch(err => {
            setError('مشکل در اتصال به سرور آب و هوا');
            console.error(err);
          });
      }, () => {
        setError('اجازه دسترسی به لوکیشن داده نشد.');
      });
    } else {
      setError('دستگاه شما از لوکیشن پشتیبانی نمی‌کند.');
    }
  }, []);

  if (error) return <div>{error}</div>;
  if (!weather) return <div>در حال گرفتن اطلاعات آب و هوا...</div>;

  return (
    <div>
      <h1>آب و هوای {weather.city}</h1>
      <p>دمای فعلی: {weather.temp}° سانتی‌گراد</p>
      <p>وضعیت آسمان: {weather.condition}</p>
    </div>
  );
}

export default App;