module.exports = function(app,connection){
    app.get('/ingredients',function(req, res, next) {
    
    var getIngredients="select i.ingredient_name from Product_Ingredient i where barcode=?";
    res.header("Access-Control-Allow-Origin", "*");
    var barcode=req.query.barcode;
    console.log("Am primit produsul:"+barcode);
    var obj;
    
    connection.query(getIngredients,[barcode],function(err, rows) {
        if(err)
          throw err;
        
        var ingredients=[];
        
        for(var v_i in rows)
        {
          var pereche={
                          id:rows[v_i].ingredient_id,
                          name:rows[v_i].ingredient_name
                       };
          ingredients.push(pereche);
        }
        
        obj={
                ingrediente:ingredients
            };
            
        console.log(obj);
        
        res.end(JSON.stringify(obj));
    });
});

}