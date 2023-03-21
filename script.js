var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var sCity=[];

function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

var APIKey="56f46ffd2b8c205e62e0a331e43e4845";

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    var queryURL="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        console.log(response);

        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString()
        ;

        $(currentCity).html(response.name + "("+date+")" + "<img src="+iconurl+">");

        var tempF = (response.main.temp - 237.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");

        $(currentHumidity).html(response.main.humidity+"%");

        var ws=response.wind.speed;
        var windmph=(ws*2.237).toFixed(1);
        $(currentWindSpeed).html(windmph+"MPH");

        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
        if (sCity==null){
            sCity=[];
            sCity.push(city.toUpperCase());
            localStorage.setItem("cityname",JSON.stringify(sCity));
            addToList(city);
        }else {
            if(find(city)>0){
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
                }
            }
        }
    });
}

function forecast(cityid){
    var queryforecastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&APPID="+APIKey;
    $.ajax({
        url:queryforecastURL,
        method:"GET"
    })
    .then(function(response){
        
        for (i=0;i<5;i++){
            var date=new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/w/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF= (((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
            var windmph= response.list[((i+1)*8)-1].wind.speed;
            

            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
            $("#fWindSpeed"+i).html(windmph+"MPH");
        }
    })
    
}

function addToList(c){
    var listEl= $("<li>"+ c.toUpperCase()+"<li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event){
    var liEl=event.tatget;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }
}

function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"))
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }
}

function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();
}

$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click",clearHistory);