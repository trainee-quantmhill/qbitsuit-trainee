import mongoose from 'mongoose';


const fashionBoxSchema = new mongoose.Schema({
    fashionBoxHeading: {
      type: String,
      required: true,
    },
    fashionBoxSubheading: {
      type: String,
      required: true,
    }
  });

  const cases = new mongoose.Schema({
    heading:{
      type:String,
      required:true,
    },
    paragraph:{
      type:String,
      required:true,
    },
    fashionBoxUrl:{
      type:String,
      required:true,
    }
  })

  const Cases = mongoose.model('caseDetails',cases)
  const FashionBox = mongoose.model('fashionBoxDetails', fashionBoxSchema)


  export {FashionBox,Cases};