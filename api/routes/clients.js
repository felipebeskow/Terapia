let NeDB = require('nedb');
let db = new NeDB({
    filename:'db/clients.db',
    autoload:true,
});

module.exports = app =>{

    app.get('/c',(req,res)=>{
        
        db.find({}).sort({name:1}).exec((err,clients)=>{
            if (err)
                app.utils.error.send(err,req,res);
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    clients
                });
            }
        });

    });

    app.post('/c',(req,res)=>{

        db.insert(req.body, (err,client)=>{
            if(err)
                app.utils.error.send(err,req,res);
            else 
                res.status(200).json(client);
        });

    });

};