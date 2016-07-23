module.exports = function(app, connection) {
    var getCampaign = "SELECT P.barcode as barcode,P.name as name,Us.first_Name as first_Name,Us.last_Name as last_Name,C.campaign_id as campaign_id,C.creation_date as creation_date from Campaign C join User Us on C.administrator=Us.email_address join Product P on P.barcode=C.barcode where C.campaign_name=? AND C.description=? AND C.campaign_photo=? AND C.administrator=? AND C.barcode=?;";
    app.get('/trimiteCampanie', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        var barcode = req.query.barcode;
        var pozaCampanie = req.query.pozaCampanie;
        var numeCampanie = req.query.numeCampanie;
        var descriereCampanie = req.query.descriereCampanie;
        var administrator = req.query.administrator;
        var obj=new Object();
        console.log(barcode+" "+pozaCampanie+" "+numeCampanie+" "+descriereCampanie+" "+administrator);
        
        connection.query(getCampaign, [numeCampanie, descriereCampanie, pozaCampanie, administrator, barcode], function(err, rows) {
            if (err) {
                res.sendStatus(409);
            }
            var campaign_id = rows[0].campaign_id;
            var creation_date=rows[0].creation_date;
            console.log("Campania creata are id-ul " + campaign_id);
            obj.campaign_id=campaign_id;
            obj.creation_date=creation_date;
            obj.first_name=rows[0].first_Name;
            obj.last_name=rows[0].last_Name;
            obj.product_barcode=rows[0].barcode;
            obj.product_name=rows[0].name;
            console.log(rows[0].first_Name+" "+rows[0].last_Name+"a creat campania cu id-ul "+ campaign_id);
            res.end(JSON.stringify(obj))
        }); 
    });

}