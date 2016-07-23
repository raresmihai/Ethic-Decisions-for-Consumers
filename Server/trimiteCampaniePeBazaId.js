module.exports = function(app, connection) {
    var getCampaign = "SELECT P.barcode as barcode,P.name as name,Us.first_Name as first_Name,Us.last_Name as last_Name,creation_date,description,campaign_name,campaign_photo,administrator from Campaign C join User Us on C.administrator=Us.email_address join Product P on P.barcode=C.barcode where C.campaign_id=?;";
    app.get('/trimiteCampaniePeBazaId', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        var campaign_id = req.query.campaign_id;
        var obj=new Object();

        connection.query(getCampaign, [campaign_id], function(err, rows) {
            if (err) {
                res.sendStatus(409);
            }
            var creation_date=rows[0].creation_date;
            console.log("Campania creata are id-ul " + campaign_id);
            obj.creation_date=creation_date;
            obj.first_name=rows[0].first_Name;
            obj.last_name=rows[0].last_Name;
            obj.product_barcode=rows[0].barcode;
            obj.product_name=rows[0].name;
            obj.creation_date=rows[0].creation_date;
            obj.description=rows[0].description;
            obj.campaign_name=rows[0].campaign_name;
            obj.campaign_photo=rows[0].campaign_photo;
            obj.email_creator_campanie=rows[0].administrator;
            console.log(rows[0].first_Name+" "+rows[0].last_Name+"a creat campania cu id-ul "+ campaign_id);
            res.end(JSON.stringify(obj))
        }); 
    });

}