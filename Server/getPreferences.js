module.exports = function(app, connection) {
    var getPreferences = "select preference from ((select ingredient_name, preference from User_Preferences where email_address=?) as Table1 natural join (select ingredient_name from Product_Ingredient where barcode=?) as Table2)";
    app.get('/getPreferences', function(req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        var user = req.query.user;
        var barcode=req.query.barcode;
        var obj=new Object();
        obj.likes=0;
        obj.dislikes=0;
        obj.alerts=0;

        connection.query(getPreferences, [user,barcode], function(err, rows) {
            if (err)
                throw err;
            if (rows.length > 0) {
                for (var v_i in rows) {
                    if (rows[v_i].preference.localeCompare("Like")==0){
                        obj.likes++;
                    }
                    if (rows[v_i].preference.localeCompare("Dislike")==0){
                        obj.dislikes++;
                    }
                    if (rows[v_i].preference.localeCompare("Alert")==0){
                        obj.alerts++;
                    }
                }
            }
            res.end(JSON.stringify(obj));
        });
    });
};