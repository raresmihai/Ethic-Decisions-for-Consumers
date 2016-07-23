module.exports = function(app, connection) {
    app.get('/getSimilarProducts', function(req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        //console.log(res.query);
        var user = req.query.user;
        var barcode=req.query.barcode;
        var category = req.query.category;
        /*Doresc sa fac recomandari pentru produsul vizualizat (P)
        Se selecteaza produsele ce indeplinesc urmatoarele conditii:
        1. Sunt din aceeasi categorie cu P
        2. Nu contin niciun ingredient aflat in zona pericol(Alert)
        3. Raportul de ingrediente comune este mai mare decat o constanta (0.3)
	        *raportul de ingrediente comune primeste la numarator nr de ingrediente comune * 2
	        iar la numitor suma numarului de ingrediente dintre P si produsul posibil sugerat
	        (se face suma deoarece daca m-as raporta doar la numarul de ingrediente a produsului P
	        iar produsul P contine putine ingrediente iar alt produs contine foarte multe atunci raportul ar fi "mincinos"
	        similar, daca m-as raporta doar la numarul de ingrediente a produsului posibil sugerat
	        acesta poate avea foarte putine ingrediente si raportul ar fi din nou "mincinos"
	        Ex: Orice contine "apa" (printre multe alte ingrediente) comparat chiar cu produsul Apa
	        ce contine doar ingredientul "apa" -> raportul ar fi 1/1.)
        3` Cum exista produse ce nu contin ingrediente se ia in calcul si aceasta conditie si nu se mai merge pe
            ramura ingrediente comune*/
        var getProductsFromTheSameCategoryHavingCommonIngredients = 
        "SELECT p.barcode AS barcode,p.name AS name,p.image AS image," + 
                "(SELECT COUNT(p1.ingredient_name) FROM Product_Ingredient p1 " + //raportul ingredientelor comune
                    "WHERE p1.barcode = ? AND " +
                    "p1.ingredient_name IN (SELECT ingredient_name FROM Product_Ingredient WHERE barcode = p.barcode )" +
                ") AS commonIngr ," +
                "(" +
                    "(SELECT COUNT(1) FROM Product_Ingredient p3 WHERE p3.barcode = p.barcode) +" +
                    "(SELECT COUNT(1) FROM Product_Ingredient p3 WHERE p3.barcode = ?)" +
                ") AS totalNrIngr " + 
        "FROM Product p " +
        "WHERE p.category_name = ? AND " + //aceeasi categorie
        "(SELECT COUNT(1) FROM User_Preferences up " +
            "WHERE up.email_address = ? " +
            "AND (up.preference = 'Alert' OR up.preference = 'Dislike') and up.ingredient_name IN " + //sa nu contina Alert sau Dislike
                "(SELECT p0.ingredient_name FROM Product_Ingredient p0 WHERE p0.barcode = p.barcode)) = 0 AND " +
            "(" +
                "(SELECT COUNT(1) FROM Product_Ingredient p3 WHERE p3.barcode = ?) = 0 OR " +
                "(SELECT COUNT(p1.ingredient_name) FROM Product_Ingredient p1 " +
                    "WHERE p1.barcode = ? AND " +
                    "p1.ingredient_name IN " +
                    "(SELECT ingredient_name FROM Product_Ingredient WHERE barcode = p.barcode )" +
                ") * 2" +
                "/" +
                "(" +
                    "(SELECT COUNT(1) FROM Product_Ingredient p3 WHERE p3.barcode = p.barcode) +" +
                    "(SELECT COUNT(1) FROM Product_Ingredient p3 WHERE p3.barcode = ?)" +
                ")" +
                ">= 0.2" +
            ")"
 
        
        connection.query(getProductsFromTheSameCategoryHavingCommonIngredients, [barcode,barcode,category,user,barcode,barcode,barcode], function(err, rows) {
            if (err) {
                console.log("Eroare la trimiterea recomandarilor");
                console.log(err.message);
            }
            if(rows.length == 0) {
                var noproducts = "no products";
                res.end(noproducts);
            }
            var sugestiiProduse = [];
            
            for(var i in rows) {
                sugestiiProduse.push(rows[i]);
            }
            
            res.end(JSON.stringify(sugestiiProduse));
        });
    });
};