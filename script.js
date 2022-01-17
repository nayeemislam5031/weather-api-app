const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const CurrentWeatherItemEl = document.getElementById("current-weather-items");
const timezoneEl = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const currentTempEl = document.getElementById('current-temp');
const weatherForecastEl = document.getElementById("weather-forecast");
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HeFormate = hour >= 13? hour %12: hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12? 'PM':'AM'
    

    timeEl.innerHTML = (hoursIn12HeFormate<10? '0' + hoursIn12HeFormate:hoursIn12HeFormate) + ':' + (minutes<10? '0'+minutes:minutes) + ' ' + `<span id="am-pm"> ${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ', ' + months[month];


}, 1000);


getWeatherData();

function getWeatherData(){
    const apiKey = 'c7bbcab2b11689ec0e0c7c579ffaf952'
    navigator.geolocation.getCurrentPosition((success)=>{


        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude= hourly, minutely &unites=metric &appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            showWeatherData(data);
        })
    
    })
} 

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current; 
    timezoneEl.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + ' N ' + data.lon + ' E';

    CurrentWeatherItemEl.innerHTML=
    `<div class="weather-items">
        <div>humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-items">
        <div>pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-items">
        <div>Wind speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-items">
        <div>Sun rise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-items">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
 

    

    `;

    let otherDayForecast = ''
    data.daily.forEach((day,idx)=> {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="image/weather-icon.png" alt="Weather-icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `
            
        } else {
            otherDayForecast +=`
            <div class="weather-forcast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="image/weather-icon.png" alt="Weather-icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night} &#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForecast;


}


