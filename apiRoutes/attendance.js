let NeDB = require('nedb');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var formidable = require('formidable');
var path = require('path');

let db = new NeDB({
    filename:'db/attendance.db',
    autoload:true,
});

let dbIridofoto = new NeDB({
    filename:'db/logUploadIridofoto.db',
    autoload:true,
});

module.exports = app =>{

    app.put('/a',(req,res)=>{
        
        app.auth(XMLHttpRequest,req,res,()=>{
            db.find({ $not: { '_disable': 'true'} }).sort({_date:-1}).exec((err,attendances)=>{
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

    });

    app.put('/iridofoto', (req,res)=>{
        let form = new formidable.IncomingForm({
            uploadDir: './upload', 
            keepExtensions: true
        });

        form.parse(req, (err,fields,files)=>{
            if(err){
                console.error(err);
                res.status(507).json({
                    error:err
                });
            } else {
                let oe = '';
                let od = '';

                if (files.oe != undefined) oe = files.oe.path;
                if (files.od != undefined) od = files.od.path;

                app.authentic(fields.id, ()=>{
                    res.status(200).json({
                        oe,
                        od
                    });
                }, ()=>{
                    res.status(511).json({
                        error:"erro ao autenticar"
                    });
                });

                dbIridofoto.insert({
                    oe,
                    od
                });
                
            }
        });
    });

    app.put('/iridofoto/log', (req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
            dbIridofoto.find().exec((error,uploads)=>{
                if (error){
                    console.error(error);
                    res.status(400).json({ error });
                }else{
                    res.status(200).json({ uploads });
                }
            });
        });
    });

    app.get('/download/idLogin/:id/file/upload/:file', (req,res)=>{

        try {

            let id = req.params.id;
            let file = req.params.file;
    
            let filepath = path.resolve(__dirname + '/../upload/' + file);
    
            console.log(`filepath:${filepath}, id:${id}, file:${file}`);
    
            app.authentic(id,()=>{
                res.type('image/jpg').sendFile(filepath);
            }, ()=>{
                res.status(511).json({
                    error:"erro ao autenticar"
                });
            });
            
        }catch(error){
            console.log(error);
            res.status(404).end();
        }
        
    });

    app.post('/a',(req,res)=>{
        
        app.auth(XMLHttpRequest,req,res,()=>{
            db.insert({
                '_date':req.body['_date'],
                '_terapia':req.body['_terapia'],
                '_attendance':req.body['_attendance'],
                '_produts':req.body['_produts'],
                '_idClient':req.body['_idClient'],
                '_od':req.body['_od'],
                '_oe':req.body['_oe'],
                '_disable':'false'
            }, (err,attendance)=>{
                if(err){
                    console.error(err);
                    res.status(400).json({
                        error: err
                    });
                }else
                    res.status(200).json({attendance});
            });
        });

    });

    app.put('/a/:id',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
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
    });

    app.post('/a/:id',(req,res)=>{
        app.auth(XMLHttpRequest,req,res,()=>{
            db.update({_id:req.params.id}, {
                '_date':req.body['_date'],
                '_terapia':req.body['_terapia'],
                '_attendance':req.body['_attendance'],
                '_produts':req.body['_produts'],
                '_idClient':req.body['_idClient'],
                '_oe':req.body['_oe'],
                '_od':req.body['_od'],
                '_disable':req.body['_disable']
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
    */

};