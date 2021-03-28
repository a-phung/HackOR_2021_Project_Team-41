//     const request = require("request");
// let url = "https://raw.githubusercontent.com/Zoooook/CoronavirusTimelapse/master/static/population.json";
// let options = { json: true };
/*window.addEventListener('load', setup);

async function setup() {
    const ctx = document.getElementById('daily_trends').getContext('2d');
    const trends = await getData();
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trends.days,
        datasets: [
          {
            label: 'Daily trends in the US',
            data: trends.new_cases,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
          }
        ]
      },
      options: {}
    });
  }

  async function getData() {
    const response = await fetch('case_daily_trends__united_states.csv', {
        headers: {
            'content-type': 'text/csv;charset=UTF-8',
            //'Authorization': //in case you need authorisation
        }
    });
    const data = await response.text();
    const days = [];
    const new_cases = [];
    const rows = data.split('\n').slice(3);
    rows.forEach(row => {
      const cols = row.split(',');
      days.push(cols[0]);
      new_cases.push(cols[1]);
    });
    return { days, new_cases };
  }
  */

function getCountyID() {
    var countyName = document.getElementById("countyName").value
    var stateName = document.getElementById("stateName").value
    request(url, options, (error, res, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && res.statusCode == 200) {
            // console.log(body);
            var result = body.filter((x) => x.subregion.toLowerCase() == countyName.toLowerCase() && x.region.toLowerCase() == stateName.toLowerCase());
            console.log(result);
            updateStateDropDown(result);
            return result;
        };
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateStateDropDown();
});

function updateStateDropDown() {
    var select = document.getElementById("stateName");
    let states = ["Alaska", "Alabama", "Arkansas", "American Samoa", "Arizona", "California", "Colorado", "Connecticut",
        "District of Columbia", "Delaware", "Florida", "Georgia", "Guam", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana",
        "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi",
        "Montana", "North Carolina", " North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York",
        "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
        "Texas", "Utah", "Virginia", "Virgin Islands", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"]
    for (var i = 0; i < states.length; i++) {
        var opt = states[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

function getCountyInfo() {
    var countyName = document.getElementById("countyName").value
    var stateName = document.getElementById("stateName").value
    let url = "https://raw.githubusercontent.com/Zoooook/CoronavirusTimelapse/master/static/population.json";

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            var info = result.filter((x) => x.subregion.toLowerCase() == countyName.toLowerCase() && x.region.toLowerCase() == stateName.toLowerCase());
               console.log(info);
            if(info.length == 0) {
                window.location.href = "/local-info/not-found"
            }
            else {
                countyCode = info[0].us_county_fips;
                window.location.href = "/local-info/county/" + countyCode;
            }
        }
    });


}

// Get the container element
var btnContainer = document.getElementById("graph-nav");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("btn");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}


function myFunction() {
    var x = document.getElementById("graph");
    var y = document.getElementById("othergraph")
    if (x.style.display === "none" && y.style.display === 'block') {
      x.style.display = "block";
      y.style.display = "none";
    } else {
      x.style.display = "none";
      y.style.display = "block"
    }
    
  }


