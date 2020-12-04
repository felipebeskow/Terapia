let NeDB = require('nedb');
let db = new NeDB({
    filename:'db/login.db',
    autoload:true,
});

module.exports = app => {
    app.put('/l',(req,res)=>{
        db.findOne({
            _login:req.body['_login']
        }).exec((e,user)=>{
            if (e){
                console.log("Login negado:",req.body['_login']);
                console.error(e);
                res.status(400).json({
                    error: e
                });  
            } else if(user['_password']==req.body['_password']){
                console.log("Login efetuado:",req.body['_login']);
                res.status(200).json({_id:user['_id']});
            } else {
                console.log("Login negado:",req.body['_login']); 
                res.status(400).json({
                    error: 'login not found'
                }); 
            }
        });
    });
    app.put('/l/id',(req,res)=>{
        db.findOne({
            _id:req.body['_id']
        }).exec((e,user)=>{
            if (e){
                console.log("Id negado:",req.body['_id']);
                console.error(e);
                res.status(400).json({
                    error: e
                });  
            } else if(user){
                console.log("Login com id efetuado:",req.body['_id']);
                res.status(200).json(user);
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
            db.insert(req.body,(e,user)=>{
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