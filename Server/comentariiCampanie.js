module.exports = function(app,connection){
  var comentariiCampanie="Select u.first_Name,u.last_Name,c.post_date,c.content,c.title from Comment c join User u on c.email_address=u.email_address where c.campaign_id=?";
  app.get('/contents',function(req, res, next) {
      var campaignId=req.query.campaignId;
      console.log('Trebuie sa obtin comentariile pentru:'+campaignId);
      res.header("Access-Control-Allow-Origin", "*");
      var obj;
      
      connection.query(comentariiCampanie,[campaignId],function(err, rows) {
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
                      /*
                      var comentariu={
                                        prenume:rows[v_i].first_Name,
                                        nume:rows[v_i].last_Name,
                                        data:string,
                                        content:rows[v_i].content,
                                        titlu:rows[v_i].title,
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