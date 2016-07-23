module.exports=function(app,connection)
{
    app.get('/myCampaign',function(req,res,err){
        
        res.header("Access-Control-Allow-Origin", "*");
        var user=req.query.user;
        var getUserInformation="select first_Name, last_Name, reputation from User where email_address=?";
        var getMyCampaing="SELECT campaign_id as id,campaign_name,administrator,concat(substring(description,1,10),'...') as description,campaign_photo,DATE_Format(creation_date,'%Y-%m-%d') as creation_date from Campaign where administrator= ? ";
        var obj=new Object();
        
        connection.query(getUserInformation,[user],function(err, rows) {
            if (err || rows.length==0){
                console.log("Utilizatorul cu e-mail-ul: "+ user+"nu exista in baza de date.");
            }
            else {
                obj.firstName=rows[0].first_Name;
                obj.lastName=rows[0].last_Name;
                obj.reputation=rows[0].reputation;
                connection.query(getMyCampaing,[user],function(err,rows){
                    if(err || rows.length==0)
                    {
                        console.log("User-ul "+user+" nu are nici o campanie existenta");
                    }
                    console.log("Vreau sa iau campaniile user-ului: "+user);
                    var campanii=[];
                    for(var i=0;i<rows.length;i++)
                    {
                        var campanie=new Object();
                        campanie.id=rows[i].id;
                        campanie.nume=rows[i].campaign_name;
                        campanie.descriere=rows[i].description;
                        campanie.poza=rows[i].campaign_photo;
                        campanie.data=rows[i].creation_date;
                        campanie.administrator=rows[i].administrator;
                        campanii.push(campanie);
                    }
                    obj.listaCampanii=campanii;
                    res.end(JSON.stringify(obj));
                });
            }
        });
    });
};