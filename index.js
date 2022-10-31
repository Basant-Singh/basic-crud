const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


let users = [
    {
        username: 'Todd',
        tweets: ['lol that is so funny!','another tweet']
    },
    {
        username: 'Skyler',
        tweets: ['I like to go birdwatching with my dog','another tweet']
    },
    {
        username: 'Sk8erBoi',
        tweets: ['Plz delete your account, Todd','another tweet']
    },
    {
        username: 'onlysayswoof',
        tweets: ['woof woof woof','another tweet']
    }
]

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.redirect("/users");
})

app.get("/users",(req,res)=>{
    res.render("index",{users});
})

app.post("/users",(req,res)=>{
    const { username } = req.body;
    if(users.some(u  => u.username.toLowerCase() === username.toLowerCase())){
        res.redirect("/users/new");
    }
    else{
        users.push({username, tweets:[]});
        res.redirect("/users");
    }
})

app.get("/users/new",(req,res)=>{
    res.render("newUser");
})

app.get("/user/:uname",(req,res)=>{
    const {uname} = req.params;
    const user = users.find(u => uname === u.username);
    res.render("singleUser",{user});
})

app.post("/user/:uname",(req,res)=>{
    const {uname} = req.params;
    const { newTweet } = req.body
    const user = users.find(u => uname === u.username);
    user.tweets.push(newTweet);
    res.redirect(`/user/${uname}`);
})

app.delete("/user/:uname",(req,res)=>{
    const {uname} = req.params;
    const updatedUsers = users.filter( u => u.username != uname);
    users = updatedUsers;
    res.redirect("/users");
})


app.get("/user/:uname/new-tweet",(req,res)=>{
    const {uname} = req.params;
    const user = users.find( u => u.username === uname);
    res.render("newTweet",{user});
})

app.delete("/user/:uname/:id",(req,res)=>{
    const {uname, id} = req.params;
    const user = users.find(u => u.username === uname);
    const tweets = user.tweets;
    const updatedTweets = tweets.filter(t => t != tweets[id]);
    user.tweets = updatedTweets;
    res.redirect(`/user/${uname}`);
})

app.get("/user/:uname/:id/edit",(req,res)=>{
    const {uname, id} = req.params;
    const user = users.find(u => u.username === uname);
    res.render("tweetEdit",{user, id});
})


app.patch("/user/:uname/:id",(req,res)=>{
    const {uname, id} = req.params;
    const {newTweet} = req.body; 
    const user = users.find(u => u.username === uname);
    const tweets = user.tweets;
    tweets[id] = newTweet;
    res.redirect(`/user/${uname}`);
})

app.listen(8080,()=>{
    console.log("Listening on port 8080");
})




