module.exports = function(app,connection){
  var reviewsOfAProduct="Select u.first_Name,u.last_Name,r.post_date,r.content,r.title,r.grade from Review r join User u on r.email_address=u.email_address where r.barcode=?";
  app.get('/reviews',function(req, res, next) {
      
      var barcode=req.query.barcode;
      console.log('Trebuie sa obtin comentariile pentru:'+barcode);
      res.header("Access-Control-Allow-Origin", "*");
      var obj;
      
      
      
      connection.query(reviewsOfAProduct,[barcode],function(err, rows) {
          if(err)
          {
            console.log("Eroare");
          }
          var comentarii=[];
          
          for(var v_i in rows)
          {
            var string=rows[v_i].post_date.toString().substring(0,15);
            var comentariu=new Object();
            comentariu.prenume=rows[v_i].first_Name;
            comentariu.nume=rows[v_i].last_Name;
            comentariu.data=string;
            comentariu.content=rows[v_i].content;
            comentariu.titlu=rows[v_i].title;
            comentariu.grade=rows[v_i].grade;
            if(comentariu.grade==1)
              comentariu.valoare1='true';
            else
              comentariu.valoare1='false';
                        
            if(comentariu.grade==2)
              comentariu.valoare2='true';
            else
              comentariu.valoare2='false';
                        
            if(comentariu.grade==3)
              comentariu.valoare3='true';
            else
              comentariu.valoare3='false';
                        
            if(comentariu.grade==4)
              comentariu.valoare4='true';
            else
              comentariu.valoare4='false';
                      
            if(comentariu.grade==5)
              comentariu.valoare5='true';
            else
            comentariu.valoare5='false';
                      /*
                      var comentariu={
                                        prenume:rows[v_i].first_Name,
                                        nume:rows[v_i].last_Name,
                                        data:string,
                                        content:rows[v_i].content,
                                        titlu:rows[v_i].title,
                                        grade:rows[v_i].grade
                                    };*/
            comentarii.push(comentariu);
          }
          
          obj={
                comentarii:comentarii
                
              };
          console.log(JSON.stringify(obj));
          res.end(JSON.stringify(obj));
      });
      
  });
}