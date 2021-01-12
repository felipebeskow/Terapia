const nodemailer = require("nodemailer");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var formidable = require('formidable');
var path = require('path');

module.exports = app => {
    app.put('/help', (req, res)=>{
        let form = new formidable.IncomingForm({
            uploadDir: './help', 
            keepExtensions: true
        });

        form.parse(req, (error, fields, files)=>{
            if(error){
                console.error(error);
                res.status(507).json({
                    error
                });
            } else {
                app.authentic(fields.idLogin, ()=>{
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
                            'Há uma solicitação de suporte na Tela ' + fields.tela + '.<br>' +
                            'Segue a mensagem:<br>' + fields.mensagem + '<br>' +
                            'PrintScreen:<br> <img src="print"/> <br>' +
                            'Mensagem gerada automaticamente pelo AppTerapia',
                        attachments: [{
                            filename: files.print.name,
                            path: files.print.path,
                            cid: 'print'
                        }]
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
                }, ()=>{
                    res.status(511).json({
                        error:"erro ao autenticar"
                    });
                });
            }
        });
    });

    
};