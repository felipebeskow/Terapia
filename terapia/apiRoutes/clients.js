let NeDB = require('nedb');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let db = new NeDB({
    filename:'db/clients.db',
    autoload:true,
});

module.exports = app =>{

    app.put('/c',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
            db.find({}).sort({_name:1}).exec((err,clients)=>{
                if (err){
                    console.error(err);
                    res.status(400).json({
                        'error': err
                    });
                }else{
                    res.status(200).json({clients});
                }
            });
        });
    });

    app.post('/c',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
           
            db.insert({
                '_name':req.body['_name'],
                '_birth':req.body['_birth'],
                '_profession':req.body['_profession'],
                '_address':req.body['_address'],
                '_telephone':req.body['_telephone'],
                '_obs':req.body['_obs']
            }, (err,client)=>{
                if(err){
                    console.error(err);
                    res.status(400).json({
                        error: err
                    });
                }else
                    res.status(200).json({client});
            });

        });
    });

    app.put('/c/:id',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
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
    });

    app.put('/cEd/:id',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
            db.update({_id:req.params.id}, {
                '_name':req.body['_name'],
                '_birth':req.body['_birth'],
                '_profession':req.body['_profession'],
                '_address':req.body['_address'],
                '_telephone':req.body['_telephone'],
                '_obs':req.body['_obs']
            }, err => {
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
    });
    /*
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
    */

};