module.exports=function(app,connection){
  
  var removePreferenceStatement="DELETE FROM User_Preferences where email_address=? AND ingredient_name=?";
  app.post('/removePreference',function(req,res,next){
      
      res.header("Access-Control-Allow-Origin", "*");
      var email=req.body.email;
      var ingredient=req.body.ingredient;
      
      connection.query(removePreferenceStatement,[email,ingredient],function(err,rows){
          
          if(err)
          {
              console.log("Eroarea la stergerea unei optiuni"+err);
              res.sendStatus(409);
              return;
          }
          res.sendStatus(200);
      });
  }); 
};