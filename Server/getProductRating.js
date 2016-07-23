module.exports=function(app,connection){
    
    var getRating="Select rating from Product where barcode=?";
    
    app.get('/rating',function(res,req,next){
        
        res.header("Access-Control-Allow-Origin", "*");
        var barcode=res.query.barcode;
        var obj;
        connection.query(getRating,[barcode],function(err,rows){
           
           if(err){
               console.log("Eroare la obtinearea rating-ului");
               req.sendStatus(409);
               return;
           } 
           
           obj={
                    'scor':rows[0].rating
                };
            
            req.end(JSON.stringify(obj));
           
        });
        
    });
};