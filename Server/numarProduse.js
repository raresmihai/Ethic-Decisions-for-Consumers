module.exports = function(app,connection){
    app.get('/numarProduse',function(req, res, next) {
        
    var numberOfProducts="select count('1') nr from ((select name,barcode,image,price from Product where name_lower LIKE lower(?) or name_lower LIKE lower(?)) UNION (select name,barcode,image,price from Product natural join Product_Ingredient where lower(ingredient_name) LIKE lower(?))) tempTable";
    res.header("Access-Control-Allow-Origin", "*");
    var product=req.query.product+" %";
    var product2="% "+req.query.product+" %";
    var productAsIngredient="% "+req.query.product+" %";
    console.log("Trebuie sa vad cate produse exista pentru:"+product);
    var obj;
    connection.query(numberOfProducts,[product,product2,productAsIngredient],function(err, rows) {
       
       if(err)
        throw err;
        
        obj={
              linii:rows[0].nr
          };
          
        res.end(JSON.stringify(obj));
    });
    
    
});
}