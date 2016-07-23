module.exports=function(app,connection){
    
    var mostRestrictiveUsers="select User.first_name as prenume,User.last_name as nume,User_Preferences.email_address as email,count('1') as numarRestrictii from User Join User_Preferences on User.email_address=User_Preferences.email_address where preference IN ('Dislike','Alert')  group by User_Preferences.email_address,User.first_name,User.last_name order by 4 desc limit 0,5 ";
    
    app.get('/mostRestrictive',function(req,res,next){
       
        res.header("Access-Control-Allow-Origin", "*");
        var obj;
        connection.query(mostRestrictiveUsers,function(err,rows){
           if(err)
           {
               console.log("Eroare la obtinerea celor mai restrictivi useri");
               return;
           }
           
           var top=[];
           for(var i=0; i<rows.length;i++)
           {
               var persoana=new Object();
               persoana.restrictii=rows[i].numarRestrictii;
               persoana.email=rows[i].email;
               persoana.nume=rows[i].nume;
               persoana.prenume=rows[i].prenume;
               top.push(persoana);
           }
           obj={
                    'top':top
                };
            res.end(JSON.stringify(obj));
            
        });
        
    });
};