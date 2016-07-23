module.exports=function(app,connection){
    
    app.post("/addProduct",function(req,res,err){
        
        res.header("Access-Control-Allow-Origin", "*");
        var barcode=req.body.barcode;
        var name=req.body.nume;
        var price=req.body.pret;
        var image=req.body.poza;
        var ingrediente=req.body.ingrediente;
        var category=req.body.categorie;
        var lowerName=name.toLocaleLowerCase();
        var obj;
        
        var insertProduct="INSERT INTO Product(barcode,name,price,image,category_name,name_lower) VALUE(?,?,?,?,?,?)";
        var checkIfIngredientAlreadyExists="Select 1 AS nrIngrediente from Product_Ingredient where ingredient_name=? ";
        var insertNewIngredient="INSERT INTO Product_Ingredient VALUES(?,?)";
        
        connection.query(insertProduct,[barcode,name,price,image,category,lowerName],function(err,rows){
            
            if(err)
            {    
                console.log("Probleme la inserarea unui produs");
                res.sendStatus(409);
                return;
            }
            
            for(var i=0;i<ingrediente.length;i++)
            {   
                console.log("Ingredient:"+i+" "+ingrediente[i]);
                connection.query(insertNewIngredient,[barcode,ingrediente[i]],function(err, rows) {
                    if(err)
                    {
                           console.log("Eroarea la inserarea unui ingredient nou:"+err);
                    }
                });
            }
                
            
            obj={ text:'Produsul a fost inserat cu succes'};
            res.end(JSON.stringify(obj));
            
            
        });
        
        
        
    });
};