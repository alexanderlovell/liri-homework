// REQUIREMENTS

// Import keys
var keys = require("./keys.js");
// Twitter npm package
var twitter = require("twitter");
// Spotify npm package
var spotify = require("spotify-web-api-node");
// request
var request = require("request");
// fs for read/write
var fs = require("fs");

// FUNCTIONS

// Spotify
console.log(keys.spotifyKeys);
// var spotifyClient = new spotify(keys.spotifyKeys);
var spotifyApi = new spotify ({
    clientID: keys.spotifyKeys.clientID,
    clientSecret: keys.spotifyKeys.clientSecret
});

var getSong = function(songTitle) {
    if (songTitle === undefined) {
        songTitle = "The Sign";
    }
    spotifyApi.searchTracks({type: "track", query: songTitle}, function(error, data) {
        if (error) {
            console.log("Error: " + error);
        }

        // console.log(keys.spotifyKeys);
        console.log(data);
        var songs = data.tracks.items;

        for (var i=0; i < songs.length; i++) {
            console.log(i);
            console.log("Artist: " + songs[i].artists.map(getSong));
            console.log("Song Name: " + songs[i].name);
            console.log("Album: " + songs[i].album.name);
        }
    });
};

// Twitter
var getTweets = function() {
    var twitterClient = new twitter(keys.twitterKeys);

    var parameters = { screen_name: "BoredElonMusk" };
    twitterClient.get("statuses/user_timeline", parameters, function(error, tweets, response) {
        if (!error) {
            for (var i=0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            }
        }
    });
};

// OMDB
var getMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = "The Big Lebowski";
    }

    // build the URL with requested movie
    var urlOMDB = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

    request(urlOMDB, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var dataOMDB = JSON.parse(body);

            console.log("Title: " + dataOMDB.Title);
            console.log("Year: " + dataOMDB.Year);
            console.log("IMDB Rating: " + dataOMDB.imdbRating);
        } else {
            console.log("Error: " + error);
        }
    });
};


// Do what it says
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        var dataArray = data.split(",");

        // parsing inputs
        if (dataArray.length === 2) {
            pick(dataArray[0], dataArray[1]);
        }
        else if (dataArray.length === 1) {
            pick(dataArray[0]);
        }
        else {
            console.log("What it says?");
        }
    });
};

// Which command gets executed
var pick = function(cases, functions) {
    // switch between cases
    switch (cases) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSong(functions);
            break;
        case "this-movie":
            getMovie(functions);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("I'm sorry, Dave. I'm afraid I can't do that");

    };
};

// Command line arguments
var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

// INPUT
runThis(process.argv[2], process.argv[3]);