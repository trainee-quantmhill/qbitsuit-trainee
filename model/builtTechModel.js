

import mongoose from "mongoose";

const builtSchema = mongoose.Schema({
    builtHeading:{
        type:String,
        required:true
    },
    builtSubheading:{
        type:String,
        required:true
    }
})


const cardsSchema = mongoose.Schema({
    cardUrl:{
        type:String,
        required:true
    },
    cardheading:{
        type:String,
        required:true
    },
    cardParagraph:{
        type:String,
        required:true
    }
})

const Built = mongoose.model('builtTechDetails',builtSchema);
const Cards=mongoose.model('cardsDetails',cardsSchema);


export {Built,Cards};
