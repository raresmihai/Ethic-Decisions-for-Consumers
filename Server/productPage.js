module.exports = function(app, connection) {
  app.post('/productPage', function(req, res, next) {
    var getProductInfo = "select * from Product where barcode=?";
    var getIngredients = "select i.ingredient_name from Product_Ingredient i where barcode=?";
    var reviewsOfAProduct = "select first_Name,last_Name,post_date,content,title,grade from User natural join (select email_address,post_date,content,title,grade from Review where barcode=?) as revTable;";
    var getProductCampaigns = "SELECT US.first_Name as first_name,US.last_name as last_name,C.campaign_id as id,C.campaign_name as campaign_name,C.administrator as administrator,C.description as description,C.campaign_photo as campaign_photo,DATE_Format(C.creation_date,'%Y-%m-%d') as creation_date, count(1) as nr_users from Campaign C join User_Campaign U on C.campaign_id=U.campaign_id join User US on US.email_address=C.administrator where barcode=? group by C.campaign_id order by nr_users desc";
   
    var getPreferenceIngredients = "SELECT ingredient_name,preference,reason FROM User_Preferences WHERE email_address = ?";
    var getSpecifications= "select S.specification_id,S.spectype,S.subspectype,S.specval from (select * from Product_Ingredient where barcode=?) as T join Specification S on T.ingredient_name=S.specification_id group by spectype, subspectype, specval;"
    var getReputation='select reputation from User where email_address=?';
    res.header("Access-Control-Allow-Origin", "*");
    
    var barcode = req.body.barcode;
    var user = req.body.user;
    var obj = new Object();
    connection.query(getProductInfo, [barcode], function(err, rows) {

      if (rows.length > 0) //Produsul exista in DB
      {
        for (var i in rows) {
          obj = {
            mesaj: 'Gasit',
            barcode: rows[i].barcode,
            name: rows[i].name,
            price: rows[i].price,
            rating: rows[i].rating,
            category: rows[i].category_name,
            image: rows[i].image
          };
          //console.log(obj);
          break;
        }
        
        connection.query(getIngredients, [barcode], function(err, rows) {
          if (err)
            console.log("A aparut o eroare la un query");

          var product_ingredients = [];

          for (var v_i in rows) {
            product_ingredients.push(rows[v_i].ingredient_name);
          }

          obj.product_ingredients = product_ingredients;

          connection.query(getPreferenceIngredients, [user], function(err, rows) {
            if (err) {
              console.log("Eroare la obtinerea ingredientelor votate de utilizatorul " + user);
            }

            var user_voted_ingredients = [];
            for (var i in rows) {
              user_voted_ingredients.push(rows[i]);
            }


            obj.user_voted_ingredients = user_voted_ingredients;

            //Fac urmatorul query
            connection.query(reviewsOfAProduct, [barcode], function(err, rows) {
              if (err) {
                console.log(err);
              }



              var comentarii = [];

              for (var v_i in rows) {
                var string = rows[v_i].post_date.toString().substring(0, 15);
                var comentariu = new Object();
                comentariu.prenume = rows[v_i].first_Name;
                comentariu.nume = rows[v_i].last_Name;
                comentariu.data = string;
                comentariu.content = rows[v_i].content;
                comentariu.titlu = rows[v_i].title;
                comentariu.grade = rows[v_i].grade;
                if (comentariu.grade == 1)
                  comentariu.valoare1 = 'true';
                else
                  comentariu.valoare1 = 'false';

                if (comentariu.grade == 2)
                  comentariu.valoare2 = 'true';
                else
                  comentariu.valoare2 = 'false';

                if (comentariu.grade == 3)
                  comentariu.valoare3 = 'true';
                else
                  comentariu.valoare3 = 'false';

                if (comentariu.grade == 4)
                  comentariu.valoare4 = 'true';
                else
                  comentariu.valoare4 = 'false';

                if (comentariu.grade == 5)
                  comentariu.valoare5 = 'true';
                else
                  comentariu.valoare5 = 'false';
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
              obj.comentarii = comentarii;
              //console.log("Comentarii:" + obj.comentarii);
              
              connection.query(getProductCampaigns, [barcode], function(err, rows) {
                if (err) {
                  console.log("A aparut o eroare la un query");
                }
                else {
                  //test();
                  var Campaigns = [];
                  for (var campaign in rows) {
                    var campaignToPush=new Object();
                    //console.log("Imaginea este:" + campaignToPush.imagine);
                    campaignToPush.first_name=rows[campaign].first_name;
                    campaignToPush.last_name=rows[campaign].last_name;
                    campaignToPush.campaign_id=rows[campaign].id;
                    campaignToPush.campaign_name = rows[campaign].campaign_name;
                    campaignToPush.description = rows[campaign].description;
                    campaignToPush.imagine = rows[campaign].campaign_photo;
                    campaignToPush.administrator=rows[campaign].administrator;
                    campaignToPush.email_creator_campanie=rows[campaign].administrator;
                    campaignToPush.creation_date=rows[campaign].creation_date;
                    Campaigns.push(campaignToPush);
                  }
                  obj.campanii = Campaigns;
                  if (obj.category.localeCompare("IT, comunicatii si foto")==0 || obj.category.localeCompare("Tv, electrocasnice si electronice")==0){
                      connection.query(getSpecifications,[barcode],function(err,rows){
                        if (err){
                          console.log("Eraoare la obtinerea specificatiilor pentru: "+barcode);
                        }
                        var spectypeobjs=[];
                        for (v_i=0;v_i<rows.length-1;){
                          var spectypeobj=new Object();
                          spectypeobj.spectype=rows[v_i].spectype;
                          spectypeobj.subspectypeobjs=[];
                          while(v_i<rows.length && spectypeobj.spectype.localeCompare(rows[v_i].spectype)==0){
                            var subspectypeobj=new Object();
                            subspectypeobj.subspectype=rows[v_i].subspectype;
                            subspectypeobj.specvalobjs=[];
                            while (v_i<rows.length && subspectypeobj.subspectype.localeCompare(rows[v_i].subspectype)==0){
                              var specvalobj=new Object();
                              specvalobj.specval=rows[v_i].specval;
                              specvalobj.specification_id=rows[v_i].specification_id;
                              specvalobj.option='Neutral';
                              specvalobj.reason='';
                              subspectypeobj.specvalobjs.push(specvalobj);
                              v_i++;
                            }
                            spectypeobj.subspectypeobjs.push(subspectypeobj);
                          }
                          spectypeobjs.push(spectypeobj);
                        }
                        obj.spectypeobjs=spectypeobjs;
                        res.end(JSON.stringify(obj));
                      });
                  }
                  else {
                    res.end(JSON.stringify(obj));
                  }
                }
              });


            });
          })
        });
      }
      else {
            if(user)
            {
                  connection.query(getReputation,[user],function(err,rows){
                if(err)
                {
                  console.log("Eroare la determinarea reputatiei");
                }
                
                obj={
                      mesaj:"Negasit",
                      reputatie:rows[0].reputation
                    };
                res.end(JSON.stringify(obj));
              });
            }
            else
            {
              obj={
                      mesaj:"Negasit"
                    };
                res.end(JSON.stringify(obj));
              
            }
          
        
        /*obj = {
          mesaj: 'Negasit'
        };
        //console.log(obj);
        
        res.end(JSON.stringify(obj));
        */
      }
      if (err)
        console.log("A aparut o eroare la un query");

    });
    
  });

};