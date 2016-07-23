module.exports = function(app, connection) {
    var getPreferences = "select preference from ((select ingredient_name, preference from User_Preferences where email_address=?) as Table1 natural join (select ingredient_name from Product_Ingredient where barcode=?) as Table2)";
    app.post('/getNumberOfLikes', function(req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");


        var products = req.body.similarProducts;
        var user = req.body.user;
        //console.log(products);
        var getNumberOfLikesForEveryProduct = 
            "SELECT barcode,COUNT(1) AS likes FROM " +
            "(SELECT * FROM Product_Ingredient WHERE barcode IN(";
            for(var i=0;i < products.length - 1;i++) {
                getNumberOfLikesForEveryProduct += products[i].barcode + ",";
            }
            getNumberOfLikesForEveryProduct+=products[i].barcode + ")) AS T1 ";
        getNumberOfLikesForEveryProduct +=
            "NATURAL JOIN " +
            "(SELECT * FROM User_Preferences WHERE email_address = ? AND preference = 'Like') AS T2 " +
            "GROUP BY barcode ";

        connection.query(getNumberOfLikesForEveryProduct, [user], function(err, rows) {
            if (err) {
                console.log("Eroare la trimiterea like-urilor pentru produse similare.");
            }
            if (rows.length > 0) {
                for (var i in rows) {
                    for(var j in products) {
                        if(products[j].barcode == rows[i].barcode) {
                            products[j].likes = rows[i].likes;
                            break;
                        }
                    }
                }
            }
            res.end(JSON.stringify(products));
        });
    });
    
};