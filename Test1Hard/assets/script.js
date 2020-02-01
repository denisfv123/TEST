function getWeather(city) {
    fetch(`http://127.0.0.1:3000/getWeather`, {
        method: 'POST',
        headers: {
           'Content-Type': 'text/plain;charset=utf-8'
        },
        body: city
    }).then((res) => {
        return res.json()
    }).then(json => {
        let days = document.querySelectorAll('.day');
        let dayWeek = document.querySelectorAll('.day-week');
        let count = 0;

        for(let i = 0; i < json.list.length; i++) {
            let time = new Date(json.list[i]["dt_txt"]).getHours();
            if((time == 12 || i == 0) && count <= 5) {
                if(i == 0) if(new Date(json.list[0]["dt_txt"]).getHours() < 12) continue;
                dayWeek[count].innerHTML = getWeekDay(json.list[i]["dt"]);
                days[count].innerHTML = json.list[i]["weather"]["0"]["main"];  
                document.getElementsByClassName('pic')[count].classList.add(`wi-owm-${json.list[i]["weather"]["0"]["id"]}`);
                count++;
            }
        }
        
    }).catch(err => {
        console.log(err);
    })
}

function weather() {
    let city = document.getElementById('city').value;
    getWeather(city);
}

function getWeekDay(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.toString().slice(0, 4);
}
