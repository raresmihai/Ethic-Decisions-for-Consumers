module.exports = function(app){
    app.get('/logout',function(req, res, next) {
    
    req.session.destroy(function(err){
      
      var obj=new Object();
      if(err)
      {
        console.log(err);
        obj.mesaj="Eroarea la logout";
      }
      else
      {
        obj.mesaj="Succes";
      }
      
      res.end(JSON.stringify(obj));
    });
    
});
}