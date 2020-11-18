var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


//schema setup
var campgroundSchema = new mongoose.Schema({
	name:String,
	img:String,
	description: String
})

var Campground=mongoose.model("Campground",campgroundSchema)

// Campground.create({
// 	name:"Rishikesh Valley Camp",
// 	img:"https://www.holidify.com/images/cmsuploads/compressed/3418318319_6caa7d0cfe_z_20190212173233.jpg",
// 	description:"beautiful outscape to an insight into nature's serenity"
// }, function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("newly created campground");
// 		console.log(campground);
// 	}
// });

app.get("/",function(req,res){
	res.render("home");
})

//INDEX
app.get("/campgrounds",function(req,res){
	//get all campgrounds from db
	Campground.find({},function(err,allCampgrounds){
		if (err){
			console.log(err);
		} else{
			res.render("index",{campgrounds:allCampgrounds});
		}
	})
})

//CREATE add new campground to DB
app.post("/campgrounds",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var newcamp={name:name,img:image,description:desc};
	//create a new campground and save to the database
	Campground.create(newcamp, function(err,newlyCreated){
		if (err){
			console.log(err); 
		}else{
			//redirect back to the campgrounds page 
			res.redirect("/campgrounds");}
	});
})

//NEW show form to create new campground
app.get("/campgrounds/new",function(req,res){
	res.render("new");

})

//show more info about one particular campground
app.get("/campgrounds/:id",function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			//render "show" template with that campground 
			res.render("show",{campground: foundCampground});
		}
	});
	
})

app.listen(3006,function(){
	console.log("Yelpcamp server is up & running on PORT:3006");
})