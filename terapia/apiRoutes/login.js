let NeDB = require('nedb');
let dbLogin = new NeDB({
    filename:'db/login.db',
    autoload:true,
});
let dbLogLogin = new NeDB({
    filename:'db/login-log.db',
    autoload:true
});

module.exports = app => {
    app.get('/l',(req,res)=>{
        res.status(200).json({
            mensagem: 'Oi, to funfando'
        });
    });
    app.post('/l',(req,res)=>{
        dbLogin.findOne({
            _login:req.body['_login']
        }).exec((e,user)=>{
            if (e){
                console.log("Login negado:",req.body['_login']);
                console.error(e);
                res.status(400).json({
                    error: e
                });  
            } else if( ( user != undefined ) && ( user['_password'] == req.body['_password'] ) ){
                console.log("Login efetuado:",req.body['_login']);
                dbLogLogin.insert({
                    _idLogin:user['_login'],
                    _datetime: new Date().getTime()
                },(er,log)=>{
                    if(e) {
                        console.error(er);
                        res.status(400).json({
                            error: er
                        });
                    } else {
                        console.log(log);
                        res.status(200).json({
                            _id:log['_id']
                        });
                    }
                });
            } else {
                console.log(req.body);
                console.log("Login negado:",req.body['_login']); 
                res.status(400).json({
                    error: 'login not found'
                }); 
            }
        });
    });
    app.put('/lr',(req,res)=>{
        dbLogLogin.findOne({
            _id:req.body['_id']
        }).exec((e,login)=>{
            
            if (e){
                console.log("Id negado:",req.body['_id']);
                console.error(e);
                res.status(400).json({
                    error: e
                });  
            } else if( ( login != undefined ) && ((new Date().getTime() - parseInt(login['_datetime']) < 259200000) ) ){
                console.log("Login renovado:",req.body['_id']);
                res.status(200).json(login);
            } else {
                console.log("Id negado:",req.body['_id']); 
                res.status(400).json({
                    error: 'id not found'
                }); 
            }
        });
    });
    app.post('/l/:passadmin',(req,res)=>{
        if (req.params.passadmin == '***REMOVED***') {
            dbLogin.insert(req.body,(e,user)=>{
                if (e){
                    console.log("Erro ao registar:",req.body);
                    console.error(e);
                    res.status(400).json({
                        error: e
                    });  
                } else {
                    res.status(200).json(user);
                }
            });
        }
    });
}