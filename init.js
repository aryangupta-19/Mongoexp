const mongoose = require("mongoose");
const Chat  = require("./models/chat.js");

main().then(() => {
    console.log("Connection Succesfull");
}).catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsap');
}


let allChats = [
    {
        from: "Neha",
        to: "Priya",
        msg: " Send me your Exam sheets.",
        created_at: new Date(),
    },
    {
        from: "Aryan",
        to: "Abhay",
        msg: " Chalna hai aaj Party krne...?",
        created_at: new Date(),
    },
    {
        from: "Piyush",
        to: "Daksh",
        msg: " Han! Delhi ki ... Kesi hai ...",
        created_at: new Date(),
    },
    {
        from: "Abhay",
        to: "Gourav",
        msg: "Bete kya hal chal...",
        created_at: new Date(),
    },
    {
        from: "Aryan",
        to: "Piyush",
        msg: " Han, piyussy ke aal hai..?",
        created_at: new Date(),
    },
]
Chat.insertMany(allChats);   // observe difference between insert many and insert one no need of any .save method ///

