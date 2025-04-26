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

  if (error) return <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontSize: '18px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5'
  }}>{error}</div>;

  if (!weather) return <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontSize: '18px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5'
  }}>در حال گرفتن اطلاعات آب و هوا...</div>;

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      backgroundColor: '#f5f5f5',
      color: '#333'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        آب و هوای {weather.city}
      </div>
      <div style={{ fontSize: '20px', marginBottom: '5px' }}>
        دمای فعلی: {weather.temp}° سانتی‌گراد
      </div>
      <div style={{ fontSize: '18px' }}>
        وضعیت آسمان: {weather.condition}
      </div>
    </div>
  );
}

export default App;