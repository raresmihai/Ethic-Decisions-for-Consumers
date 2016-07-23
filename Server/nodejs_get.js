var express =require("express"),
	cors= require('cors'),
	app=express();
var bodyParser=require("body-parser");
var mysql=require("mysql");
var morgan= require("morgan");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);



app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(morgan("dev"));

//Allows CORS Request; Acts like a middleware
app.use(function(req, res, next) {
 
 	  res.header("Access-Control-Allow-Origin", "*");   
  	res.header("Access-Control-Allow-Methods",'GET,PUT,POST,DELETE');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

//I make the connection to DB

var connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"c9"
  
});

connection.connect(function(err){
  if(err)
  {
    console.log("Error connecting to DB");
    return;
  }
  
  console.log("Connection established");
});
/*
var query="SELECT '1' FROM User where email_address=? and password=? ";
connection.query(query,["ciprian.lazar95@gmail.com",'12356'],function(err,rows){
  
  if(err)
    throw err;
    console.log("Data received from BD");    console.log(rows.length);
    if(rows.length>0) // a intors o linie
      console.log("Logged");
    else
      console.log("Log failed");
})
*/

var sess_option={
                    path:"./tmp/sessions/",
                    useAsync:true
                  };

app.use(session({
    
    store:new FileStore(sess_option),
    secret:'my_secret_key',
    cookie: { maxAge: 10000*60*2 } ,
    saveUninitialized:false,
    httpOnly:false,
    resave:true
}));



require('./user')(app);

require('./logout')(app);

require('./productPage')(app,connection);

require('./register')(app,connection);

require('./adaugaComentariu')(app,connection);

require('./ingredients')(app,connection);

require('./product')(app,connection);

require('./products')(app,connection);

require('./numarProduse')(app,connection);

require('./review')(app,connection);

require('./comentariiCampanie')(app,connection);

require('./login')(app,connection);

require('./optiuniIngredient')(app,connection);

require('./getNumberOfMembersFor')(app,connection);

require('./getSimilarProducts')(app,connection);

require('./trimiteCampanieCreata')(app,connection);

require('./trimiteCampanii')(app,connection);

require('./adaugaComentariuCampanie')(app,connection);

require('./getNumberOfLikes')(app,connection);

require('./aderatCampanie')(app,connection);

require('./aderareCampanie')(app,connection);

require('./creareCampanie')(app,connection);

require('./addProduct')(app,connection);

require('./myCampaign')(app,connection);

require('./getUserPreferences')(app,connection);

require("./removePreference")(app,connection);

require("./productExists")(app,connection);

require("./getReputation")(app,connection);

require("./getMostRestrictiveUsers")(app,connection);

require("./getUserActivities")(app,connection);

require("./trimiteCampaniePeBazaId")(app,connection);

require("./getProductRating")(app,connection);

require("./top5Products")(app,connection);

app.listen(process.env.PORT,function(){
  console.log("astept la 127.0.0.1:80");
});