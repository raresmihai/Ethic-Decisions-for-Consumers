module.exports = function(app,connection){
    app.post('/register',function(req,res,next){
  
  var registerQuerySimilarAccount="Select '1' from User where email_address=?";
  var registerQueryInsertData="Insert into User(email_address,first_Name,last_Name,password) Values(?,?,?,?)";

  console.log('Primit cerere');
  
  var email=req.body.email;
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;
  var password=req.body.password;
  
  res.header("Access-Control-Allow-Origin", "*");
  
  console.log("Am primit o cerere de la "+email +' cu parola'+password);
  
  var contNou=true;
  
  connection.query(registerQuerySimilarAccount,[email],function(err, rows) {
      
      setTimeout(function(){},1000);
      
      if(err) {
        console.log("Eroare la inregistrare");
      }
        
      
      console.log('Numarul de randuri'+rows.length);
      
      if(rows.length==0) //nu exista deja adresa
      {
         connection.query(registerQueryInsertData,[email,firstName,lastName,password],function(err, rows) {
        
                if(err)
                {
                  console.log("Eroare la inserarea unui nou user:"+err);
                }
                
                var obj={ text:"Account created"};
                res.end(JSON.stringify(obj));
          });
         
      }
      else
      {
        var obj={text:"This email is already used!!"};
        res.end(JSON.stringify(obj));
      }
      contNou=true;
  });
  console.log("Noua stare a contului"+contNou);
  /*
  if(contNou==true)//inseram valorile in DB
  {
    connection.query(registerQueryInsertData,[email,firstName,lastName,password],function(err, rows) {
        
        if(err)
          throw err;
        
        var obj={ text:"Account created"};
        res.end(JSON.stringify(obj));
    });
  }
  else
  {
    var obj={text:"This email is already used!!"};
    res.end(JSON.stringify(obj));
  }
  */
  
});

}