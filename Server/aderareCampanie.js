module.exports = function(app, connection) {
    var aderatCampanie = "insert into User_Campaign values(?,?)";
    app.get('/aderareCampanie', function(req, res, next) {
        var campaignId = req.query.campaignId;
        var administrator = req.query.administrator;
        var first_Name;
        var last_Name;
        var action;
        var link_name;
        var insertAction = "INSERT INTO Actions VALUES(?,?,?,?,'aderare_campanie',?,?,now());";
        var getUserInfo = "SELECT first_Name,last_Name FROM User WHERE email_address = ?";
        var getCampaignName = "SELECT campaign_name FROM Campaign WHERE campaign_id = ?";
        console.log('Trebuie sa adaug aderarea pentru campania cu id-ul' + campaignId + ' si userul' + administrator);
        res.header("Access-Control-Allow-Origin", "*");
        connection.query(aderatCampanie, [campaignId, administrator], function(err, rows) {
            if (err) {
                console.log("Eroare la adaugarea aderarii campaniei " + campaignId);
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
                connection.query(getCampaignName, [campaignId], function(err, rows) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    link_name = rows[0].campaign_name;
                    action = "Utilizatorul " + first_Name + " " + last_Name + " a aderat la campania ";
                    connection.query(insertAction, [administrator, first_Name, last_Name, action, link_name, campaignId], function(err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log("Adaugare cu succes aderarea user-ului " + administrator + " la campania cu id-ul " + campaignId);
                        res.sendStatus(200);
                    });
                });
            });
        });
    });
}