let NeDB = require('nedb');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let db = new NeDB({
    filename:'db/clients.db',
    autoload:true,
});



module.exports = app =>{

    app.put('/c',(req,res)=>{

        let ajax = new XMLHttpRequest();
        let message = '';
        let passou = false;

        ajax.open('PUT', app.host + '/lr');

        message = `_id=${req.body['_id']}`;
    

        ajax.onload = e => {
            try{
                ajax.responseText.parse
                if( (JSON.parse(ajax.responseText)!=undefined) && (JSON.parse(ajax.responseText)['error']==undefined) ){
                    passou = true;
                    db.find({}).sort({name:1}).exec((err,clients)=>{
                        if (err){
                            console.error(err);
                            res.status(400).json({
                                'error': err
                            });
                        }else{
                            res.status(200).json({clients});
                        }
                    });
                } else {
                    console.log('Login negado');
                    res.status(400).json({
                        'error': 'Login Negado'
                    });                    
                }
            } catch(error) {
                console.error(error);
                res.status(400).json({
                    'error': error,
                    'ajax': ajax.responseText,
                    'host': app.host,
                    'passou': passou
                });
            }
        }

        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.send(message);
    });

    app.post('/c',(req,res)=>{

        db.insert(req.body, (err,client)=>{
            if(err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else
                res.status(200).json({client});
        });

    });

    app.get('/c/:id',(req,res)=>{
        db.findOne({_id:req.params.id}).exec((err,user)=>{
            if (err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    user
                });
            }
        });
    });

    app.put('/c/:id',(req,res)=>{
        db.update({_id:req.params.id}, req.body, err => {
            if (err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                res.status(200).json(req.body);
            }
        });
    });

    app.delete('/c/:id',(req,res)=>{
        db.remove({_id:req.params.id},{},(err,n)=>{
            if(err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                if(n == 1) res.status(200).json({usersDelete: req.params.id, nUsers: n});
                else res.status(400).json({error:{key: req.params.id}});
            }
        });
    });



};