module.exports = function(app, connection) {
    app.get('/getUserActivities', function(req, res, next) {
        var user = req.query.user;

        /*
            Queries to find similar users based on similarity
            similarity = 50% * nrOfCommonCampaignsRatio + 50% * nrOfCommonIngredientsRatio;
        */
        var getUsers = "SELECT email_address user ,0 similarity FROM User WHERE email_address != ?";
        var getMyNrOfCampaigns = "SELECT COUNT(1) myCampCount FROM User_Campaign where email_address = ?";
        var getMyNrOfPreferences = "SELECT COUNT(1) myPrefCount FROM User_Preferences WHERE email_address = ?";
        var getNrOfCommonCampaigns =
            "SELECT uc2.email_address user , COUNT(1) nrC FROM User_Campaign uc1 " +
            "JOIN User_Campaign uc2 ON uc1.campaign_id = uc2.campaign_id " +
            "WHERE uc1.email_address = ? AND uc2.email_address != ? " +
            "GROUP BY uc2.email_address";
        var getNrOfCommonPreferences =
            "SELECT up2.email_address user ,COUNT(1) nrP FROM User_Preferences up1 " +
            "JOIN User_Preferences up2 ON (up1.ingredient_name,up1.preference) = (up2.ingredient_name,up2.preference) " +
            "WHERE up1.email_address = ? AND up1.email_address != ? " +
            "GROUP BY up2.email_address";

        //get all the users with similarity = 0 at beginning
        connection.query(getUsers, [user], function(err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            var similar_users = rows;
            connection.query(getMyNrOfCampaigns, [user], function(err, rows) {
                if (err) {
                    console.log(err);
                    return;
                }
                var myCampCount = rows[0].myCampCount;
                connection.query(getMyNrOfPreferences, [user], function(err, rows) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    var myPrefCount = rows[0].myPrefCount;
                    connection.query(getNrOfCommonCampaigns, [user,user], function(err, rows) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        var commonCampaigns = rows;
                        connection.query(getNrOfCommonPreferences, [user,user], function(err, rows) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            var commonPreferences = rows;
                            getUserActivities(similar_users, commonCampaigns, commonPreferences, myCampCount, myPrefCount, connection, res);
                        });
                    });
                });
            });
        });
    });

    function getUserActivities(similar_users, commonCampaigns, commonPreferences, myCampCount, myPrefCount, connection, res) {
        //add common campaign ratio to similarity 
        for (var i = 0; i < commonCampaigns.length; i++) {
            for (var j = 0; j < similar_users.length; j++) {
                if (commonCampaigns[i].user == similar_users[j].user) {
                    similar_users[j].similarity = 50 / 100 * (commonCampaigns[i].nrC / myCampCount);
                    break;
                }
            }
        }
        //add common ingredients ratio to similarity
        for (var i = 0; i < commonPreferences.length; i++) {
            for (var j = 0; j < similar_users.length; j++) {
                if (commonPreferences[i].user == similar_users[j].user) {
                    similar_users[j].similarity = 50 / 100 * (commonPreferences[i].nrP / myPrefCount);
                    break;
                }
            }
        }
        similar_users.sort(function(a, b) { //descending sort by similarity
            return b.similarity - a.similarity;
        });
        similar_users = similar_users.slice(0, 10); //get only top 10 similar users
        //compute the getActions for every user query 
        var getActions = "SELECT * FROM Actions WHERE email_address IN(";
        for (var i = 0; i < similar_users.length - 1; i++) {
            getActions += "'" + similar_users[i].user + "', ";
        }
        getActions += "'" + similar_users[i].user + "') ";
        getActions += "ORDER BY action_time DESC LIMIT 30";
        connection.query(getActions, function(err, rows) {
            if (err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(rows));
        });
    }
}