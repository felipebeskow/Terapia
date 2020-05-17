let NeDB = require('nedb');
let db = new NeDB({
    filename:'db/clients.db',
    autoload:true,
});

module.exports = app =>{

    app.get('/c',(req,res)=>{
        
        db.find({}).sort({name:1}).exec((err,clients)=>{
            if (err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                res.status(200).json({clients});
            }
        });

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