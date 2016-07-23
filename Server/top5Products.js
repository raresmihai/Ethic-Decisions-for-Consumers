module.exports=function(app,connection)
{
    app.get('/top5Products',function(req,res,err){
        
        res.header("Access-Control-Allow-Origin", "*");
        var getTop5Products="select barcode,name,image from Product order by rating desc LIMIT 5;";
        var obj=new Object();
        
        connection.query(getTop5Products,function(err, rows) {
            if (err || rows.length==0){
                console.log("Nu exista top 5 produse cele mai cotate.");
            }
            else {
                obj.topProduse=[];
                for (var i in rows){
                    var prod=new Object();
                    prod.barcode=rows[i].barcode;
                    prod.name=rows[i].name;
                    prod.image=rows[i].image;
                    obj.topProduse.push(prod);
                }
                console.log(obj);
                res.end(JSON.stringify(obj));
            }
        });
    });
};