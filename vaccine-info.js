module.exports = function () {
    var express = require('express');
    const request = require("request");
    var router = express.Router();


    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var index = -1;
        // getCountryVaccinationData(res, context, complete, index);
        res.render('vaccine-info', context);

        // function complete() {
        //     callbackCount++;
        //     if (callbackCount >= 1) {

        //     }
        // }

    });
    return router;
}();