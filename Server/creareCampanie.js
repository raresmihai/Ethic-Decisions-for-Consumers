module.exports = function(app, connection) {
    app.post('/creareCampanie', function(req, res, next) {

        var insertCampaign = "INSERT INTO Campaign (campaign_name,description,campaign_photo,administrator,barcode,creation_date) VALUES(?,?,?,?,?,now());";
        var getCampaign = "SELECT campaign_id from Campaign where campaign_name=? AND description=? AND campaign_photo=? AND administrator=? AND barcode=?;";
        res.header("Access-Control-Allow-Origin", "*");

        var barcode = req.body.barcode;
        var pozaCampanie = req.body.pozaCampanie;
        var numeCampanie = req.body.numeCampanie;
        var descriereCampanie = req.body.descriereCampanie;
        var administrator = req.body.administrator;
        var first_Name;
        var last_Name;
        var action;
        var link_id;
        var obj;
        var insertAction = "INSERT INTO Actions VALUES(?,?,?,?,'creare_campanie',?,?,now());";
        var getUserInfo = "SELECT first_Name,last_Name FROM User WHERE email_address = ?";
        connection.query(insertCampaign, [numeCampanie, descriereCampanie, pozaCampanie, administrator, barcode], function(err, rows) {
            if (err) {
                //res.sendStatus(409);
                console.log(err);
                console.log("Eroare la inserare");
                return;
            }
            connection.query(getUserInfo, [administrator], function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (rows.length > 0) {
                    first_Name = rows[0].first_Name;
                    last_Name = rows[0].last_Name;
                }
                action = "Utilizatorul " + first_Name + " " + last_Name + " a creat campania ";
                connection.query(getCampaign, [numeCampanie, descriereCampanie, pozaCampanie, administrator, barcode], function(err, rows) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    link_id = rows[0].campaign_id;
                    connection.query(insertAction, [administrator, first_Name, last_Name, action, numeCampanie, link_id], function(err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log("Voi crea campania cu numele " + numeCampanie + " a userului " + administrator);
                        res.sendStatus(200);
                    });
                });
            });
        });
    });
}