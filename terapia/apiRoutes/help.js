const nodemailer = require("nodemailer");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = app => {
    app.put('/h',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
            let transport = nodemailer.createTransport({
                host: app.config.emailSender.host,
                port: app.config.emailSender.port,
                requireTLS: app.config.emailSender.requireTLS,
                auth: {
                    user: app.config.emailSender.auth.user,
                    pass: app.config.emailSender.auth.pass
                }
            });
            const message = {
                from: app.config.emailSender.auth.user,
                to: app.config.emailReceiver,
                subject: 'Pedido de Suporte (no-reply)',
                html: 'Bom dia,<br>' +
                    'há uma solicitação de suporte na Tela ' + req.body.tela + '.<br>' +
                    'Segue a mensagem:<br>' + req.body.mensagem + '<br>' +
                    'Mensagem gerada automaticamente pelo AppTerapia'
            };
            transport.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err);
                    res.status(500).json({err});
                } else {
                    console.log(info);
                    res.status(200).json({info});
                }
            });
            
        });
    });

    
};