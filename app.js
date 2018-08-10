var express = require("express");
var app = express();

var methodOverride = require("method-override");

var request = require("request");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/movie_app5");


var movieSchema = new mongoose.Schema({
    name: String,
    releaseYear: String,
    imdbID: String,
    poster: String,
    runtime: String,
    genre: String,
    director: String,
    actors: String,
    plot: String,
    imdbRating: String,
    rottenRating: String,
    personalRating: Number,
    personalReview: String

});

var movie = mongoose.model('movie', movieSchema);


app.get("/", function(req, res) {
    movie.find({}, function(err, movies) {
        if (err) {
            console.log(err)
        } else {
            console.log("found movies!~!!!!")
            console.log(movies);
            res.render("search", {movies: movies});
        }
    })

});

app.get("/results", function(req, res) {
   var query = req.query.search;        //  Data from form
   var url = "http://omdbapi.com/?apikey=thewdb&s=" + query;
   request(url, function(error, response, body) {
     
      if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          console.log(data);
          res.render("results", {data:data});
      } 
   });
});

app.get("/movies/:idOfMovie",function(req, res) {
    var id = req.params.idOfMovie;
    var url = "http://omdbapi.com/?apikey=thewdb&i=" + id;
   request(url, function(error, response, body) {
     
      if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          console.log(data)
          res.render("details", {data: data});
      } 
   });
    
});


app.post("/movies/:idOfMovie", function(req, res) {
    let id = req.params.idOfMovie;
    let url = "http://omdbapi.com/?apikey=thewdb&i=" + id;
    request(url, function(error, response, body) {
     
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            movie.create({
                name: data.Title,
                releaseYear: data.Year,
                imdbID: data.imdbID,
                poster: data.Poster,
                runtime: data.Runtime,
                genre: data.Genre,
                director: data.Director,
                actors: data.Actors,
                plot: data.Plot,
                imdbRating: data.Ratings[0].Value,
                rottenRating: data.Ratings[1].Value,
                personalRating: null,
                personalReview: null
                
                }, function(err, movie) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('movie created');
                        console.log(movie)
                        res.redirect("/")
                    }
                })
            
     
        } 
     });



})


app.listen(3000, function() {
   console.log("Server started"); 
});

