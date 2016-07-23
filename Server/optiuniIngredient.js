module.exports = function(app, connection) {
    app.post('/optiuneIngredient', function(req, res, next) {

        var ingredient = req.body.ingredient;
        var user = req.body.user;
        var optiune = req.body.optiune;
        var motiv = req.body.motiv;
        var barcode = req.body.barcode;
        var product_name = req.body.product_name;
        var eroare = false;
        var raspuns = "";
        res.header("Access-Control-Allow-Origin", "*");

        console.log('User-ul:' + user + ' a introdus urmatoare optiune:' + optiune + ' pt ingredientul:' + ingredient + " deoarece:" + motiv);

        var checkUserPreference = "SELECT '1' FROM User_Preferences WHERE email_address = ? AND ingredient_name = ?";
        var updateUserPreference = "UPDATE User_Preferences SET preference = ? , reason = ? WHERE email_address = ? AND ingredient_name = ?"
        var insertUserPreference = "INSERT INTO User_Preferences VALUES(?,?,?,?)";
        var improveRating="update User set reputation=reputation+50 where email_address=?";



        connection.query(checkUserPreference, [user, ingredient], function(err, rows) {

            if (err) {
                console.log("Eroare la verificarea preferintei pentru utilizatorul " + user);
                raspuns = "Din pacate preferinta dumneavoastra nu a putut fi salvata.";
                res.end(raspuns);
            }

            if (rows.length == 0) //nu exista salvata preferinta utilizatorului pentru acest ingredient
            {
                connection.query(insertUserPreference, [user, ingredient, optiune, motiv], function(err, rows) {
                    if (err) {
                        console.log("user:" + user + " " + "ingredient: " + ingredient + " optiune:" + optiune + "motiv: " + motiv);
                        console.log("Eroare la inserarea preferintei pentru utilizatorul " + user);
                        raspuns = "Din pacate preferinta dumneavoastra nu a putut fi salvata.";
                    }
                    else {
                        console.log("Am inserat optiunea " + optiune + " pentru perechea (" + user + "," + ingredient + ")");
                        connection.query(improveRating,[user],function(err, rows) {
                            if(err)
                            {
                                console.log("Eroare la actualizare reputatie");
                            }
                        });
                        raspuns = "Preferinta dumneavoastra a fost salvata!";
                    }
                    saveActionInDB(user,product_name,barcode,ingredient,optiune,raspuns,res);
                });
            }
            else {
                connection.query(updateUserPreference, [optiune, motiv, user, ingredient], function(err, rows) {
                    if (err) {
                        console.log("Eroare la update-ul preferintei pentru utilizatorul " + user);
                        raspuns = "Din pacate preferinta dumneavoastra nu a putut fi salvata.";
                    }
                    else {
                        console.log("Am updatat optiunea " + optiune + " pentru perechea (" + user + "," + ingredient + ").");
                        raspuns = "Preferinta dumneavoastra a fost actualizata!";
                    }
                    saveActionInDB(user,product_name,barcode,ingredient,optiune,raspuns,res);
                });
            }
        });

    });

    function saveActionInDB(user, link_name, link_id, ingredient, optiune, raspuns, res) {
        var insertAction = "INSERT INTO Actions VALUES(?,?,?,?,'votare_ingredient',?,?,now());";
        var getUserInfo = "SELECT first_Name,last_Name FROM User WHERE email_address = ?";
        var first_Name;
        var last_Name;
        var action;

        connection.query(getUserInfo, [user], function(err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            if (rows.length > 0) {
                first_Name = rows[0].first_Name;
                last_Name = rows[0].last_Name;
            }
            switch (optiune) {
                case "Like":
                    action = "Utilizatorului " + first_Name + " " + last_Name + " ii place ingredientul " + ingredient + " din produsul ";
                    break;
                case "Dislike":
                    action = "Utilizatorului " + first_Name + " " + last_Name + " ii displace ingredientul " + ingredient + " din produsul ";
                    break;
                default:
                    action = "Utilizatorul " + first_Name + " " + last_Name + " considera un pericol ingredientul " + ingredient + " din produsul ";
            }
            connection.query(insertAction, [user, first_Name, last_Name, action, link_name, link_id], function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.end(raspuns);
            });
        });
    }
};