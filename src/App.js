import React, { useState, useEffect } from "react";
import axios from "axios";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";
import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
} from "react-icons/bs";
import {
  IoMdSunny,
  IoMdCloudy,
  IoMdRainy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";

const API_KEY = "ca27d7bff29da20ceb13b452f65e54c7";

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("karachi");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrormsg] = useState("");
  const date = new Date();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      setLocation(inputValue);
    }
    const input = document.querySelector("input");
    if (!input.value) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    }
    input.value = "";
  };

  useEffect(() => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    axios
      .get(url)
      .then((res) =>
        setTimeout(() => {
          setData(res.data);
          setLoading(false);
        }, 1500)
      )
      .catch((error) => {
        setLoading(false);
        setErrormsg(error);
      });
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setErrormsg(""), 2000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  if (!data) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center">
        <ImSpinner8 className="text-5xl animate-spin text-white" />
      </div>
    );
  }

  const weatherIcon = {
    Clouds: <IoMdCloudy />,
    Haze: <BsCloudHaze2Fill />,
    Rain: <IoMdRainy className="text-[#31cafb]" />,
    Clear: <IoMdSunny className="text-[#ffde33]" />,
    Drizzle: <BsCloudDrizzleFill className="text-[#31cafb]" />,
    Snow: <IoMdSnow className="text-[#31cafb]" />,
    Thunderstorm: <IoMdThunderstorm />,
  }[data.weather[0]?.main];

  return (
    <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && (
        <div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md">{`${errorMsg.response?.data.message}`}</div>
      )}
      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/20 w-full max-w-[450px] rounded-[32px] backdrop-blur-[32px] mb-8`}
      >
        <div className="h-full relative flex items-center justify-end p-2">
          <input
            type="text"
            placeholder="Search by city or country"
            onChange={(event) => setInputValue(event.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light h-full pl-6"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-[32px] flex justify-center items-center transition"
          >
            <IoMdSearch className="text-2xl text-white" />
          </button>
        </div>
      </form>

      <div className="w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[10px] rounded-[32px] py-12 px-6">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <ImSpinner8 className="text-white text-5xl animate-spin" />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-x-5">
              <div className="text-[87px]">{weatherIcon}</div>
              <div>
                <div className="text-2xl font-semibold">
                  {`${data.name}, ${data.sys.country}`}
                </div>
                <div>{`${date.getUTCDate()}/${
                  date.getUTCMonth() + 1
                }/${date.getUTCFullYear()}`}</div>
              </div>
            </div>

            <div className="my-20">
              <div className="flex items-center justify-center">
                <div className="text-[144px] leading-none font-light">
                  {parseInt(data.main.temp)}
                </div>
                <div className="text-4xl">
                  <TbTemperatureCelsius />
                </div>
              </div>
              <div className="capitalize text-center">
                {data.weather[0]?.description}
              </div>
            </div>

            <div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsEye />
                  </div>
                  <div>{`Visibility ${data.visibility / 1000} km`}</div>
                </div>

                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsThermometer />
                  </div>
                  <div className="flex">
                    {`Feels like ${parseInt(data.main.feels_like)}`}
                    <TbTemperatureCelsius />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsWater />
                  </div>
                  <div>{`Humidity ${data.main.humidity} %`}</div>
                </div>

                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsWind />
                  </div>
                  <div>{`Wind ${data.wind.speed} m/s`}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
