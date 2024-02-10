
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  bannerHeading: {
    type: String,
    required: true,
  },
  bannerParagraph: {
    type: String,
    required: true,
  },

  imageUrls: {
      type: [String], 
      required: true,
      default: []     //for default vale
  },
});

const Banner = mongoose.model('bannerDetails', bannerSchema);

export default Banner;