var express       = require('express');
var app           = express();
var bodyParser 	  = require('body-parser');
var mongoose      = require('mongoose');
var flash		  = require('connect-flash');
var passport      = require('passport');
var LocalStrategy = require("passport-local");
var Campground    = require("./models/campground");
var Comment 	  = require("./models/comment");
var User 		  = require("./models/user");
var seedDB 		  = require("./seeds");
var methodOverride = require("method-override");

// requiring routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

// seedDB(); //seed the database

// connect with databse
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {'useNewUrlParser': true});
mongoose.connect("mongodb+srv://qizhen:Rao199547!@yelpcamp-gatio.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true
}).then(() => {
	console.log("connected to DB");
}).catch(err => {
	console.log('ERROR:', err.message);
});
// mongodb+srv://qizhen:Rao199547!@yelpcamp-gatio.mongodb.net/test?retryWrites=true&w=majority

// set up body parser
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passport config
app.use(require("express-session")({
	// secrete: can be anything you want
	secret: "Once again Evan Lin is the best!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// User.authenticate() comes from passport-local-mongoose, otherwise need to write it by self
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, function() {
	console.log("YelpCamp server is started!")
});