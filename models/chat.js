const mongoose = require("mongoose");
// here our model will be created...

const chatSchema = new mongoose.Schema({
    // note: id will be auto created by mongoose 
    from : {
        type: String,
        required: true,
    },
    to : {
        type: String,
        required: true,
    },
    msg : {
        type: String,
        maxLength: 50,  // maximum length of message is 50 chars 
    },
    created_at : {
        type: Date,
        required: true,
    }
});

const Chat = mongoose.model("Chat",chatSchema);     // we made our collections...

module.exports = Chat;