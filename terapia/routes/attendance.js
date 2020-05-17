let NeDB = require('nedb');
let db = new NeDB({
    filename:'db/attendance.db',
    autoload:true,
});

module.exports = app =>{

    app.get('/a',(req,res)=>{
        
        db.find({}).sort({name:1}).exec((err,attendances)=>{
            if (err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                res.status(200).json({attendances});
            }
        });

    });

    app.post('/a',(req,res)=>{

        db.insert(req.body, (err,attendance)=>{
            if(err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else
                res.status(200).json({attendance});
        });

    });

    app.get('/a/:id',(req,res)=>{
        db.findOne({_id:req.params.id}).exec((err,attendance)=>{
            if (err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    attendance
                });
            }
        });
    });

    app.put('/a/:id',(req,res)=>{
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

    app.delete('/a/:id',(req,res)=>{
        db.remove({_id:req.params.id},{},(err,n)=>{
            if(err){
                console.error(err);
                res.status(400).json({
                    error: err
                });
            }else{
                if(n == 1) res.status(200).json({usersDelete: req.params.id, nAttendance: n});
                else res.status(400).json({error:{key: req.params.id}});
            }
        });
    });

};