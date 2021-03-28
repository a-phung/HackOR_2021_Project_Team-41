module.exports = function () {
    var express = require('express');
    const request = require("request");
    var router = express.Router();
    const fs = require('fs');


    function getStateLinks(res, context, complete) {
        let rawdata = fs.readFileSync('./public/assets/state_vaccine_distribution.json');

        fs.readFile('./public/assets/state_vaccine_distribution.json', (err, data) => {
            if (err) throw err;
            let stateData = JSON.parse(data);
            context.stateVaccineLinks = stateData;
            // console.log(data);
            complete();
        });
        




    }


    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var index = -1;
        getStateLinks(res, context, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('helpful-links', context);
            }
        }

    });
    return router;
}();