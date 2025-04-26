import React, { useState, useEffect } from 'react';

function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=aff89acecaa64716df36812fa895dc07`)
          .then(response => response.json())
          .then(data => {
            setResponse(data);  // مستقیم داده دریافتی رو ذخیره کنیم
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
  if (!response) return <div>در حال گرفتن اطلاعات...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', direction: 'ltr' }}>
      <h2>خروجی API:</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

export default App;