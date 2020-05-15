module.exports = app =>{
    send:(err,req,res,code=400)=>{
        console.error(err);
        res.status(400).json({
            error: err
        });
    }
};