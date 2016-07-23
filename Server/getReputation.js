module.exports = function(app, connection) {

    var getMyReputation = "Select reputation from User where email_address= ?";

    app.get('/getReputation', function(req, res, err) {

        res.header("Access-Control-Allow-Origin", "*");
        var email = req.query.email;

        connection.query(getMyReputation, [email], function(err, rows) {

            if (err || rows == 0) {
                res.sendStatus(409);
                return;
            }

            var obj = {
                reputatie: rows[0].reputation
            };

            res.end(JSON.stringify(obj));
        });
    });

};