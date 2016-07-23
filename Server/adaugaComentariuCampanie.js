module.exports = function(app,connection){
    app.post('/adaugaComentariuCampanie',function(req, res, next) {
    
     var insertComment="INSERT INTO Comment (campaign_id,email_address,content,post_date,title) VALUES(?,?,?,now(),?);";
     res.header("Access-Control-Allow-Origin", "*");
     var email=req.body.email;
     var title=req.body.title;
     var content=req.body.content;
     var campaign_id=req.body.campaign_id;
     console.log("Review:"+content);
     
     var obj;
     
     connection.query(insertComment,[campaign_id,email,content,title],function(err, rows) {
         if(err)
         {
           console.log("Eroare la insertReview");
           res.sendStatus(409);
         }
        obj={
              mesaj:'Comentariul a fost adaugat cu succes'
        };
        res.end(JSON.stringify(obj));
     });
});

}