// openAPI weather api

// 오늘 날씨 조회
export const getWeatherInfo = async () => {
  const apikey = import.meta.env.VITE_WEATHER_API_KEY;
  const lang = "kr";
  const units = "metric";
  const city = "Seoul";
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&lang=${lang}&units=${units}`;

  const response = await fetch(api);
  const data = await response.json();

  return data["weather"][0]["description"];
};
