module.exports.courtyard = function (application, req, res) {

    var connection = application.config.dbConnection();
    var courtyardModel = new application.app.models.CourtyardDAO(connection);

    var id_courtyard = req.params.id;

    courtyardModel.getCourtyard(id_courtyard, function (error, result) {
        res.json(result[0]);
    });

}

module.exports.courtyards = function (application, req, res) {

    var connection = application.config.dbConnection();
    var courtyardModel = new application.app.models.CourtyardDAO(connection);

    courtyardModel.getAllCourtyards(function (error, result) {
        res.json(result);
    });

}

module.exports.countDocumentsFromCourtyards = function (application, req, res) {

    var connection = application.config.dbConnection();
    var courtyardModel = new application.app.models.CourtyardDAO(connection);
    var documentModel = new application.app.models.DocumentDAO(connection);

    var id_courtyard = req.params.id;

    documentModel.getAllOnCourtyardHoristsDocumentsFromCourtyard(id_courtyard, function (error, resultHorists) {
        documentModel.getAllOnCourtyardMonthlyDocumentsFromCourtyard(id_courtyard, function (error, resultMonthly) {
            documentModel.getAllOnCourtyardAuthorizedDocumentsFromCourtyard(id_courtyard, function (error, resultAuthorized) {
                documentModel.getAllOnCourtyardAffiliateDocumentsFromCourtyard(id_courtyard, function (error, resultAffiliates) {
                    courtyardModel.getCourtyard(id_courtyard, function (error, resultCourtyard) {

                        var total = Object.keys(resultAffiliates).length +
                            Object.keys(resultMonthly).length +
                            Object.keys(resultHorists).length +
                            Object.keys(resultAuthorized).length;

                        var onCourtyard = total;
                        var outCourtyard = resultCourtyard[0].qtd - total;

                        courtyardModel.updateCountCourtyard(onCourtyard, outCourtyard, id_courtyard, function (error, resultDB) {
                            courtyardModel.getCourtyard(id_courtyard, function (error, resultCourtyardFinal) {

                                var counts = (`{"Afiliados" : "${Object.keys(resultAffiliates).length}",
                                "Mensalistas" : "${Object.keys(resultMonthly).length}",
                                "Horistas" : "${Object.keys(resultHorists).length}",
                                "Autorizados" : "${Object.keys(resultAuthorized).length}",
                                "Disponível" : "${resultCourtyardFinal[0].qtd - total}"
                                }`);

                                var result = JSON.parse(counts);
                                res.json(result);
                            });
                        });
                    });
                });
            });
        });
    });

}

module.exports.insertCourtyard = function (application, req, res) {

    var connection = application.config.dbConnection();
    var courtyardModel = new application.app.models.CourtyardDAO(connection);

    var courtyard = req.body;
    courtyard.outCourtyard = courtyard.qtd;

    courtyardModel.insertCourtyard(courtyard, function (error, resultDB) {
        courtyardModel.getCourtyard(resultDB.insertId, function (error, result) {
            res.json(result[0]);
        });
    });

}

module.exports.updateCourtyard = function (application, req, res) {

    var connection = application.config.dbConnection();
    var courtyardModel = new application.app.models.CourtyardDAO(connection);

    var id_courtyard = req.params.id;
    var courtyard = req.body;

    courtyardModel.updateCourtyard(courtyard, id_courtyard, function (error, resultDB) {
        courtyardModel.getCourtyard(id_courtyard, function (error, result) {
            res.json(result[0]);
        });
    });

}

module.exports.deleteCourtyard = function (application, req, res) {

    var connection = application.config.dbConnection();
    var courtyardModel = new application.app.models.CourtyardDAO(connection);

    var id_courtyard = req.params.id;

    courtyardModel.deleteCourtyard(id_courtyard, function (error, result) {
        res.json(result);
    });

}