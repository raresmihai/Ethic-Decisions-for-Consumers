module.exports = function(app, connection) {
  app.post('/getNumberOfMembersFor', function(req, res, next) {
     var nrUsersCampaign = "select count(1) nrUsers from User_Campaign where campaign_id=?";
     var campaign_id=req.body.campaign_id;
     var obj=new Object();
     
     connection.query(nrUsersCampaign,[campaign_id],function(err, rows) {
        if (err){
          console.log("Eroare la obtinere numarului de useri pt campania: "+campaign_id);
        }
        console.log("campaign_id="+campaign_id);
        obj.nrUsers=rows[0].nrUsers;
        res.end(JSON.stringify(obj));
     });
  });
}
        