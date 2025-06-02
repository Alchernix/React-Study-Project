import { useEffect, useState, useRef } from "react";
import { toZonedTime, format } from "date-fns-tz";
import "./WeatherApp.css";

// function Search({ handleSearch }) {
//   const [keyword, setKeyword] = useState("");

//   return (
//     <form
//       className="search-container"
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleSearch(keyword);
//       }}
//     >
//       <input
//         type="text"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         placeholder="Enter city name"
//       />
//       <button id="search-btn" className="search-btn">
//         Search
//       </button>
//     </form>
//   );
// }

export default function WeatherApp() {
  const [cityName, setCityName] = useState("Seoul");
  const [condition, setCondition] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weatherImgSrc, setWeatherImgSrc] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windspeed, setWindspeed] = useState("");

  const timezone = useRef("Asia/Seoul");
  const [time, setTime] = useState("");

  async function getWeatherInfo(cityName) {
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?key=${
          import.meta.env.VITE_API_KEY
        }`
      );
      const responseData = await response.json();
      const currentConditions = responseData.currentConditions;

      const temperature = ((currentConditions.temp - 32) * (5 / 9)).toFixed(1);
      const iconName = currentConditions.icon;

      setCityName(responseData.address);
      timezone.current = responseData.timezone;
      setCondition(currentConditions.conditions);
      setTemperature(temperature);
      setWeatherImgSrc(
        `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/refs/heads/main/PNG/1st%20Set%20-%20Color/${iconName}.png`
      );
      setHumidity(currentConditions.humidity);
      setWindspeed(currentConditions.windspeed);
    } catch (err) {
      alert("Invalid city name!");
    }
  }

  function handleSearch(keyword) {
    const formatted = keyword[0].toUpperCase() + keyword.slice(1);
    setCityName(formatted);
    getWeatherInfo(formatted);
  }

  // 초기 날씨정보
  useEffect(() => {
    let ignore = false;

    getWeatherInfo("Seoul");

    return () => {
      ignore = true;
    };
  }, []);

  // 매 초마다 시간 갱신
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const zonedDate = toZonedTime(now, timezone.current);
      const time = format(zonedDate, "hh:mm a");
      setTime(time);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container">
      <div className="city-name">{cityName}</div>
      <div className="time">{time}</div>
      <div className="condition">{condition}</div>
      <img src={weatherImgSrc || "#"} className="weather-img" alt="weather" />
      <div className="temperature">{temperature}</div>

      <div className="detail-container">
        <div className="detail">
          <i className="fa-solid fa-droplet"></i>
          <div>
            <div className="humidity">{humidity}</div>
            <div>Humidity</div>
          </div>
        </div>
        <div className="detail">
          <i className="fa-solid fa-wind"></i>
          <div>
            <div className="windspeed">{windspeed}</div>
            <div>Windspeed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

WeatherApp.appName = "날씨";
WeatherApp.Icon = () => <span style={{ fontSize: "24px" }}>🌤️</span>;
