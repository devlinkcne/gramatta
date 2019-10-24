module.exports.form_configEstacionamento = function (application, req, res) {
  var connection = application.config.dbConnection();
  var configEstacionamentoModel = new application.app.models.ConfigEstacionamentoDAO(
    connection
  );

  configEstacionamentoModel.getConfigEstacionamento(function (error, result) {
    res.render("config/configEstacionamento.ejs", {
      configEstacionamento: result,
      success: {},
      validacao: {}
    });
  });
};

module.exports.form_configEstacionamento_save = function (application, req, res) {

  var configEstacionamento = req.body;

  req.assert('nome_fantasia', 'O Nome Fantasia é obrigatório').notEmpty();
  req.assert('cnpj', 'O CNPJ contém 18 números').len(18, 18);
  req.assert('inscricao_municipal', 'A inscrição Municipal contém apenas números').isInt();

  var erros = req.validationErrors();

  if (erros) {
    console.log(configEstacionamento);
    res.render("config/configEstacionamento.ejs", { validacao: erros, configEstacionamento: configEstacionamento, success: {} });
    return;
  }

  var connection = application.config.dbConnection();
  var configEstacionamentoModel = new application.app.models.ConfigEstacionamentoDAO(
    connection
  );

  configEstacionamentoModel.setConfigEstacionamento(configEstacionamento, function (error, result) {
    console.log(configEstacionamento);
    res.render("config/configEstacionamento.ejs", {
      configEstacionamento: configEstacionamento,
      success: {},
      validacao: {}
    });
  });

};
