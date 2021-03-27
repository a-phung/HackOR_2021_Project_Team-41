//     const request = require("request");
// let url = "https://raw.githubusercontent.com/Zoooook/CoronavirusTimelapse/master/static/population.json";
// let options = { json: true };

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
            console.log("Getting code")
            console.log(info);
            if(info.length == 0) {
                window.location.href = "/local-info/not-found"
            }
            else {
                countyCode = info[0].us_county_fips
                window.location.href = "/local-info/county/" + info[0].us_county_fips;
            }
        }
    });


}