module.exports = function(app,connection){
    var logInQuery="Select first_Name,last_Name,reputation From User where email_address=? and password=?";
    app.post('/login',function(req, res, next) {
    
    var email=req.body.email;
    var password=req.body.password;
    res.header("Access-Control-Allow-Origin", "*");
    
    var response;
    
    
    console.log('Primit cerere de conectare de la:'+email+' cu parola:'+password);
    
    //Fac verificare in baza de date
    
    connection.query(logInQuery,[email,password],function(err,rows){
      
      if(rows.length>0)
       { 
         req.session.first_Name=rows[0].first_Name;
         req.session.last_Name=rows[0].last_Name;
         req.session.email=email;
         response={
                    text:"Login Succes",
                    firstName:rows[0].first_Name,
                    lastName:rows[0].last_Name,
                    reputation:rows[0].reputation
                  };
       }
      else
        response={ 
                    text:"Email or password are invalid"
          
                  };
      console.log(response);
      if(err)
        throw err;
        
       res.end(JSON.stringify(response));
      
      });
    });
};