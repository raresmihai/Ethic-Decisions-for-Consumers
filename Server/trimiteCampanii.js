module.exports=function(app,connection)
{
    app.get('/trimiteCampanii',function(req,res,err){
        
        res.header("Access-Control-Allow-Origin", "*");
        var user=req.query.user;
        var getCampaigns="SELECT P.barcode as barcode,P.name as name,US.first_Name as first_name,US.last_Name as last_name,C.campaign_id as id,C.campaign_name as campaign_name,C.administrator as administrator,C.description as description,C.campaign_photo as campaign_photo,DATE_Format(C.creation_date,'%Y-%m-%d') as creation_date, count(1) as nr_users from Campaign C join User_Campaign U on C.campaign_id=U.campaign_id join User US on US.email_address=C.administrator join Product P on P.barcode=C.barcode group by C.campaign_id order by nr_users desc;";
        var obj;
        
        connection.query(getCampaigns,function(err,rows){
            if(err || rows.length==0)
            {
                res.sendStatus(409);
                console.log("Nu exista campanii");
            }
            var campanii=[];
            for(var i=0;i<rows.length;i++)
            {
                var campanie=new Object();
                campanie.id=rows[i].id;
                campanie.nume=rows[i].campaign_name;
                campanie.descriere=rows[i].description;
                campanie.poza=rows[i].campaign_photo;
                campanie.data=rows[i].creation_date;
                campanie.email_creator_campanie=rows[i].administrator;
                campanie.last_name=rows[i].last_name;
                campanie.first_name=rows[i].first_name;
                campanie.product_barcode=rows[i].barcode;
                campanie.product_name=rows[i].name;
                campanie.nrUsers=rows[i].nr_users;
                campanii.push(campanie);
            }
            
            obj={
                    listaCampanii:campanii
                };
            res.end(JSON.stringify(obj));
            
            
        });
    });
};