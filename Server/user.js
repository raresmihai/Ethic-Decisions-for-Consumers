module.exports = function(app){
    app.get('/user',function(req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    var obj= new Object();
    console.log(JSON.stringify(req.session));
    if(req.session.first_Name)
    {
      obj.text="Este Logat";
      obj.first_name=req.session.first_Name;
      obj.last_name=req.session.last_Name;
      obj.email=req.session.email;
    }
    else
    {
      obj.text="Nu este Logat";
    }
    res.end(JSON.stringify(obj));
});
}