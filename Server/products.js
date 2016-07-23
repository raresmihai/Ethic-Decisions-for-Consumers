module.exports = function(app, connection) {
    var getProducts = "(select name, barcode,image,price from Product where name_lower=? order by rating desc) UNION (select name,barcode,image,price from Product where name_lower LIKE lower(?) order by rating desc) UNION (select name,barcode,image,price from Product where name_lower LIKE lower(?) order by rating desc) UNION (select name,barcode,image,price from Product natural join (select * from Product_Ingredient where lower(ingredient_name) LIKE lower(?)) as Prod_Ingr order by rating desc) Limit ?,?";
    app.get('/products', function(req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        var product=req.query.product;
        var product1 = req.query.product + " %";
        var product2 = "% " + req.query.product + " %"
        var productAsIngredient = "% " + req.query.product + " %";
        var pagina = req.query.pagina;
        var user = req.query.user;
        var firstProduct = (pagina - 1) * 10;
        var lastProduct = 10;
        /*console.log("FirstProduce:" + firstProduct);
        console.log("LastProduct:" + lastProduct);
        console.log("Trebuie sa caut:" + product + ".Pagina" + pagina);*/
        var obj;

        connection.query(getProducts, [product, product1, product2, productAsIngredient, firstProduct, lastProduct], function(err, rows) {
            if (err){
                console.log("Eroare la cautarea de produse pentru cuvantul: "+req.query.product);
            }
            else{
                if (rows.length > 0) {
                    var listOfProducts = [];
                    for (var v_i in rows) {
                        var produs= new Object();
                        produs.name=rows[v_i].name;
                        produs.image=rows[v_i].image;
                        produs.price=rows[v_i].price;
                        produs.barcode=rows[v_i].barcode;
                        listOfProducts.push(produs);
                    }
                    
                    if (user!='' && user!=null){
                        var barcodes="";
                        for (var product in listOfProducts){
                            listOfProducts[product].likes=0;
                            listOfProducts[product].dislikes=0;
                            listOfProducts[product].alerts=0;
                            barcodes=barcodes+"'"+listOfProducts[product].barcode+"',";
                        }
                        barcodes=barcodes.substring(0, barcodes.length - 1);
                        var getPreferences = "SELECT barcode,preference,COUNT(1) nr FROM (SELECT * FROM Product_Ingredient WHERE barcode IN ("+barcodes+")) AS T1 NATURAL JOIN (SELECT * FROM User_Preferences WHERE email_address = ?) AS T2 GROUP BY barcode,preference;";
                        connection.query(getPreferences,[user],function(err,rows){
                            if (err){
                                console.log("Eroare la obinerea preferintelor la produse cautate pentru ulitizatorul: "+user);
                            }
                            else{
                                for(var product in listOfProducts){
                                    for (var v_i in rows){
                                        if(rows[v_i].barcode.localeCompare(listOfProducts[product].barcode)==0){
                                            if (rows[v_i].preference.localeCompare("Like")==0){
                                                listOfProducts[product].likes=rows[v_i].nr;
                                            }
                                            if (rows[v_i].preference.localeCompare("Dislike")==0){
                                                listOfProducts[product].dislikes=rows[v_i].nr;
                                            }
                                            if (rows[v_i].preference.localeCompare("Alert")==0){
                                                listOfProducts[product].alerts=rows[v_i].nr;
                                            }
                                        }
                                    }
                                }
                                obj = {
                                    text: 'Gasit',
                                    products: listOfProducts
                                    };
                                res.end(JSON.stringify(obj));
                            }
                        });
                    }
                    else {
                        obj = {
                        text: 'Gasit',
                        products: listOfProducts
                        };
                        res.end(JSON.stringify(obj));
                    }   
                }
                else {
                    obj = {
                        text: 'Negasit'
                    };
                    res.end(JSON.stringify(obj));
                }
            }
        });
    });
}