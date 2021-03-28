//Routes and funcitons for display info about covid, including info at a county level

module.exports = function () {
    var express = require('express');
    const request = require("request");
    var router = express.Router();

    var papa = require('papaparse')

    stateLevelVaccineUrl = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv';
    countryLevelVaccineUrl = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/United%20States.csv'
    locationDataUrl = "https://raw.githubusercontent.com/Zoooook/CoronavirusTimelapse/master/static/population.json";
    maskDataUrl = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/mask-use/mask-use-by-county.csv"
    countyCaseDataUrl = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties-recent.csv"

    function getCountyMaskData(res, context, complete, countyCode) {
        options = { header: true };
        const dataStream = request.get(maskDataUrl);
        const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

        dataStream.pipe(parseStream);

        let data = [];
        parseStream.on("data", chunk => {
            data.push(chunk);
        });

        parseStream.on("finish", () => {
            var result = data.filter((x) => x.COUNTYFP == countyCode);
            context.maskData = result;
            complete();
        });

    }

    function getCountyNameFromCode(countyCode) {
        stateName = "";
        let options = { json: true };
        request(locationDataUrl, options, (error, res, body) => {
            if (error) {
                return console.log(error)
            };

            if (!error && res.statusCode == 200) {
                var result = body.filter((x) => x.us_county_fips == countyCode);
                countyName = result[0].subregion;
                return countyName;
            };
        });
    }

    function getRecentCountyCaseData(res, context, complete, index) {

        countyName = getCountyNameFromCode(index);

        options = { header: true };
        const dataStream = request.get(maskDataUrl);
        const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

        dataStream.pipe(parseStream);

        let data = [];
        parseStream.on("data", chunk => {
            data.push(chunk);
        });

        parseStream.on("finish", () => {
            var result = data.filter((x) => x.county == countyName);
            context.recentCaseData = result;
            complete();
        });

    }

    function getCountryVaccinationData(res, context, complete) {
        options = { header: true };
        const dataStream = request.get(countryLevelVaccineUrl);
        const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);
        var dateRange = new Date();
        

        dataStream.pipe(parseStream);

        let data = [];
        parseStream.on("data", chunk => {
            data.push(chunk);
        });

        parseStream.on("finish", () => {
            context.CountryVaccines = data;

            dateRange.setDate(dateRange.getDate() - 14);
            var result = data.filter((x) => x.date > dateRange);
            console.log(result);
            context.CountryVaccines2Weeks = result;

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

        parseStream.on("finish", () => {
            var result = data.filter((x) => x.location == stateName);
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
                stateName = result[0].region;
                getStateVaccinationContext(stateName, res, context, complete);
            };
        });
    }

    function countyNotFoundMessage(res, context, complete, id) {
        context.errorMessage = "Sorry, the county couldn't be located";
        complete();
    }


    //Display information at country level (US)
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var index = -1;
        getCountryVaccinationData(res, context, complete, index);

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
        getStateVaccinationData(res, context, complete, req.params.id);
        getCountyMaskData(res, context, complete, req.params.id);
        getRecentCountyCaseData(res, context, complete, req.params.id);

        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('local-info', context);

            }
        }
    });

    router.get('/not-found', function (req, res) {
        var callbackCount = 0;
        var context = {};S
        // var index = [req.params.id];
        // getCountryVaccinationData(res, context, complete, req.params.id);
        countyNotFoundMessage(res, context, complete, req.params.id);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('local-info', context);

            }
        }
    });

    return router;
}();


