const nodemailer = require("nodemailer");

module.exports = app => {
    app.post('/h',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{

            let transport = nodemailer.createTransport({
                host: 'smtp.umbler.com',
                port: 587,
                requireTLS: true,
                auth: {
                    user: 'felipe@beskow.net.br',
                    pass: '***REMOVED***'
                }
            });
            const message = {
                from: 'felipe@beskow.net.br',
                to: 'felipebeskow@outlook.com',
                subject: 'Help Terapia',
                html: `${JSON.stringify(req.body)}`
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