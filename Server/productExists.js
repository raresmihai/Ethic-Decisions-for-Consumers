module.exports=function(app,connection){
  
  var checkIfProductExists="SELECT '1' from Product where barcode=? " ;
  
  app.get('/productExists',function(req,res,next){
     
     res.header("Access-Control-Allow-Origin", "*");
     var barcode=req.query.barcode;
     connection.query(checkIfProductExists,[barcode],function(err,rows){
        
        if(err || rows.length==0)
        {
            console.log("Nu exista barcode-ul cautat");
            res.sendStatus(409);
            return;
        }
        
        res.sendStatus(200);
        
     });
     
      
  });
  
  
};