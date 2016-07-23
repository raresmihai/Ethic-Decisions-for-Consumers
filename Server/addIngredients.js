module.exports=function(app,connection){
    
    app.post("/addIngredients",function(req,res,err){
        
         res.header("Access-Control-Allow-Origin", "*");
         var barcode=req.body.barcode;
         var ingrediente=req.body.ingrediente;
         var checkIfIngredientAlreadyExists="Select 1 AS nrIngrediente from Product_Ingredient where ingredient_name=? ";
         var insertNewIngredient="INSERT INTO Product_Ingredient VALUES(?,?)";
         
         for(var i=0;i<ingrediente.length;i++)
         {
             //verificam daca ingredientul exista in baza de date
             connection.query(checkIfIngredientAlreadyExists,[ingrediente[i]],function(err,rows){
                 if(err)
                 {
                     
                 }
             });
         }
         
        
    });
};