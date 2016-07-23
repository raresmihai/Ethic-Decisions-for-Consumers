module.exports = function(app, connection) {
    var aderatCampanie = "select count(1) aAderat from User_Campaign where campaign_id=? and email_address=? ";
    app.get('/aderatCampanie', function(req, res, next) {
        var campaignId = req.query.campaignId;
        var administrator = req.query.administrator;
        console.log('Trebuie sa obtin aderare campanie pentru: campania cu id-ul' + campaignId + ' si userul' + administrator);
        res.header("Access-Control-Allow-Origin", "*");
        var obj = new Object();
        connection.query(aderatCampanie, [campaignId, administrator], function(err, rows) {
            if (err) {
                console.log("Eroare la obtinerea aderarii campaniei " + campaignId);
            }
            console.log("campaignId=" + campaignId);
            obj.aAderat = rows[0].aAderat;
            console.log("aderare=" + rows[0].aAderat);
            res.end(JSON.stringify(obj))
        });

    });
}