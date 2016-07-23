module.exports = function(app,connection){
  var getProductInfo="Select * from Product where barcode=?";
  app.get('/product',function(req, res, next) {
      
      res.header("Access-Control-Allow-Origin", "*");
      var barcode=req.query.barcode;
      console.log("Am primit produsul:"+barcode);
      var obj;
      connection.query(getProductInfo,[barcode],function(err, rows) {
          
          if(rows.length>0) //Produsul exista in DB
          {
            
            for(var i in rows)
            {
              obj ={
                          mesaj:'Gasit',
                          barcode:rows[i].barcode,
                          name:rows[i].name,
                          weight:rows[i].weight,
                          price:rows[i].price,
                          rating:rows[i].rating,
                          image:rows[i].image
              };
             
              
              
              console.log(obj);
              
              break;
            }
            
          }
          else
          {
            obj={
                        mesaj:'Negasit'
                    };
            console.log(obj);
            
          }
          
          if(err)
            throw err;
            
          res.end(JSON.stringify(obj));
      });
     
      
  });
}