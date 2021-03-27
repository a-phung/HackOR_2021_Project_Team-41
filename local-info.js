//Routes and funcitons for display info about covid, including info at a county level

module.exports = function () {
    var express = require('express');
    const request = require("request");
    var router = express.Router();

    var papa = require('papaparse')

    stateLevelVaccineUrl = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv';
    countryLevelVaccineUrl = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/United%20States.csv'
    locationDataUrl = "https://raw.githubusercontent.com/Zoooook/CoronavirusTimelapse/master/static/population.json";



    function getCountryVaccinationData(res, context, complete) {
        options = { header: true };
        const dataStream = request.get(countryLevelVaccineUrl);
        const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

        dataStream.pipe(parseStream);

        let data = [];
        parseStream.on("data", chunk => {
            data.push(chunk);
        });

        parseStream.on("finish", () => {
            context.CountryVaccines = data;
            // console.log(data);
            complete();
        });


    }

    function getStateVaccinationContext(stateName, res, context, complete) {

        options = { header: true };
        const dataStream = request.get(stateLevelVaccineUrl);
        const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

        dataStream.pipe(parseStream);

        let data = [];
        parseStream.on("data", chunk => {
            data.push(chunk);
        });

        console.log("STate Name: ");
        console.log(stateName);
        parseStream.on("finish", () => {
            var result = data.filter((x) => x.location == stateName);
            // console.log(result);
            console.log(result.length);
            context.StateVaccines = result;
            complete();
        });

    }

    function getStateVaccinationData(res, context, complete, countyCode) {

        stateName = "";
        let options = { json: true };
        request(locationDataUrl, options, (error, res, body) => {
            if (error) {
                return console.log(error)
            };

            if (!error && res.statusCode == 200) {
                var result = body.filter((x) => x.us_county_fips == countyCode);
                console.log("FILTER RESULT ");
                console.log(result);
                stateName = result[0].region;
                getStateVaccinationContext(stateName, res, context, complete);
            };
        });


    }


    //Display information at country level (US)
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var index = -1;
        getCountryVaccinationData(res, context, complete, index);
        console.log(index)

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('local-info', context);

            }
        }

    });

    // Display information about a specifically selected county
    router.get('/county/:id', function (req, res) {
        var callbackCount = 0;
        var context = {};
        // var index = [req.params.id];
        console.log("COUNTY INFO");
        console.log(req.params.id);
        getStateVaccinationData(res, context, complete, req.params.id);
        // console.log(index)

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('local-info', context);

            }
        }


    });

    return router;
}();


