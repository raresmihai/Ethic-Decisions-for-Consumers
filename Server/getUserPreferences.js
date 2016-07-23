module.exports=function(app,connection){
    
    app.get('/getUserPreferences',function(req,res,err){
        
        res.header("Access-Control-Allow-Origin", "*");
        var email=req.query.email;
        var getPreferences="select u.ingredient_name,u.preference,u.reason from User_Preferences u left join Specification s on u.ingredient_name=s.specification_id  where email_address=? and s.specification_id is null;";
        var like=[];
        var dislike=[];
        var aleert=[];
        
        var message;
        
        connection.query(getPreferences,[email],function(err,rows){
            
            if(err|| rows.length==0)
            {
                console.log('Nu are nici o preferinta');
                res.sendStatus(409);
                return;
            }
            
            for(var i=0;i<rows.length;i++)
            {
                var obj=new Object();
                obj.ingredient_name=rows[i].ingredient_name;
                obj.optiune=rows[i].preference;
                obj.motiv=rows[i].reason;
                if(rows[i].preference.localeCompare('Like')==0)
                {
                    like.push(obj);
                }
                else if(rows[i].preference.localeCompare('Dislike')==0)
                {
                     dislike.push(obj);
                }
                else
                {
                     aleert.push(obj);
                }
            }
            
            message={
                        'like':like,
                        'dislike':dislike,
                        'alert':aleert
                    };
            //console.log("User-ul:"+email+" are preferintele:"+JSON.stringify(message));
            res.end(JSON.stringify(message));
            
        });
    });
};