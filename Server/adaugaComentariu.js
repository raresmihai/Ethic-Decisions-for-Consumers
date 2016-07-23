module.exports = function(app,connection){
    app.post('/adaugaComentariu',function(req, res, next) {
    
     var insertReview="INSERT INTO Review(email_address,barcode,title,grade,content,post_date) VALUES(?,?,?,?,?,now());";
     var improveRating="update User set reputation=reputation+50 where email_address=?";
     res.header("Access-Control-Allow-Origin", "*");
     
     var email=req.body.email;
     var barcode=req.body.barcode;
     var title=req.body.title;
     var grade=req.body.grade;
     var review=req.body.review;
     console.log("Review:"+review);
     
     var obj;
     
     connection.query(insertReview,[email,barcode,title,grade,review],function(err, rows) {
         if(err)
         {
           console.log("Eroare la insertReview"+err);
           res.sendStatus(409);
         }
         
        
        connection.query(improveRating,[email],function(err,rows){
            if(err)
            {
                console.log("Eroare la actualizarea reputatiei");
            }
            
            obj={
              mesaj:'Comentariul a fost adaugat cu succes'
            };
            
            res.end(JSON.stringify(obj));
        });
        
        
     });
});

};