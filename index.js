const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat  = require("./models/chat.js");
const methodOverride= require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // basically we are telling our static files like css js will be served from public folder;.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connection Succesfull");
}).catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsap');
}

// let chat1 = new Chat({
//     from: "Neha",
//     to: "Priya",
//     msg: " Send me your Exam sheets.",
//     created_at: new Date()
// });

// chat1.save().then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });

// INDEX ROUTE 

app.get("/chats", async (req, res) => {
    // lets extract all of our data first 
    // Chat.find();  we can make it thenable or all of our data can be stored in some varibale 

    let chats = await Chat.find();
    // console.log(chats);
    // res.send(chats);
    res.render("index.ejs", {chats});
});

// New Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
    // throw new ExpressError(404, "Page not found");
});


// create route 
app.post("/chats", async (req,res, next) => {
    try{
        let{from, to, msg} = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date()
        });
    
        await newChat.save();
        res.redirect("/chats");
    }catch(err){
        // console.log(err);
        next(err);
    }
});

function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err) => next(err));
    };
}

// show route 
app.get("/chats/:id", asyncWrap( async (req, res, next) => {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            return next(new ExpressError(404, "Chat Not Found!"));
        }
        res.render("edit.ejs", { chat });
}));

// edit route 
app.get("/chats/:id/edit", async (req, res, next) => { // note here we are not using then that is why we used async awwait
    try{
        let {id} = req.params;
        // search for chat in database using id
        let chat = await Chat.findById(id);
        res.render("edit.ejs", {chat});
    }catch(err){
        next(err);
    }
});

// Update route 
app.put("/chats/:id", async (req, res) => {
    let{ id } = req.params;
    let{msg: newMsg} = req.body;

    // search document from database using id and update it 

    let updatedChat = await Chat.findByIdAndUpdate(id,
        {msg: newMsg},
        {runValidators: true, new: true}
    );
    console.log(updatedChat);
    res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
    let {id} = req.params;
    // find by id and delete 
    let deletedChat = await Chat.findByIdAndDelete(id, {new: true, runValidators: true});
    console.log(deletedChat);
    res.redirect("/chats");
    // res.send("Deleted...");
});

app.get("/", (req, res) => {
    res.send("Working Root...!");
});  



// error handling 
const handleValidationError = (err) => {
    console.log("This is a validation Error hadler function (callback)");
    console.log(err.message);
    return err;
}


app.use((err, req, res, next) => {
    console.log(err.name);
    if(err.name === "CastError"){   
        err = handleValidationError();
    }
    next(err);
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    let {status = 500, message = "Some error Occured!"} = err;
    res.status(status).send(message);
 });

app.listen(8080, () => {
    console.log(`Server is Listening on port: 8080`);
});


// now we have to make a seperate folder for models to be created 
// no need to create connection again and again becoz we will require model from chat.js to index.js 
// now lets insert data so that our databse would be created 

// note if extra keyValue pair is sent to save in databse it won't be saved until we don't have that field in our schema 
// note -> its always benefitial to initialise databse with some data initally 
// we will do similarly 
// make file init.js 
// where we will write code to initalise any data 

// till now inserted all sample data now lets create our routes 
// first route will be index route -> get -> /chats -> where we will see all of our data 
//  note chat.find()   is an asynchronous function which will retuern a promise so we have to await for it and await is only used in async functions so make your callback as async function 
// now lets send all our data to client -> using templates  and style them accordingly in public folder-> style.css 



// next routes --> new-route and create-route
// new chat-> ik btn-> new chat (button) this btn makes get request /chats/new which renders a form in which we can write a new message 
// submit button of form makes a post request -> which inserts new chats in databse 
// we can;t directly extract data from req.body -> first of all we have to parse the data 
// app.use(express.urlencoded(extended: true)) ;
// now afterparsing and extracting through deconstruct method we will create a interface for chat model where we will set our extracted data 
// now note we note adding multiple chats simultaneously instead we are adding only one therefore use .save() asynchronous method...



// lets handle date and time -> chat.created_at -> {Thu Dec 18 2025 13:58:40 GMT+0530 (India Standard Time)}
// there is a lot of infromation in this format of date and time but we only want { time and date } 
// first of all convert all this to a string using function toString() -> now split this string to extract time -> split where ever spaces are present -> { .split(" ") all will be get converted in form of array and space ki jagah comma dikhega
// Fri,Dec,19,2025,14:43:34,GMT+0530,(India,Standard,Time)  -> here time is at 4th idx 
// now we only want only first four indexes of array that is 0 1 2 3 
// so first divide array into two parts -> lika array ko todke inko ik new array mai convert kro use .slice() method .slice(0,4) divide array from 0 to 4 
// then join that all 4 pieces of array using .join()
//  chat.created_at.toString().split(" ").slice(0, 4).join("-")  now here joined with help of a space or hyphen
// now from here new created chats would also have seperated 





// now lets go for the edit route ab 
// edit form pr get req lagane ke bad -> edit form se put request lagani hai for that npm i method-override
// action="/chat?_method=PUT"


// now do your self delete btn with each chat 


