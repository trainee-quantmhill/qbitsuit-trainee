
import mongoose from 'mongoose';

const collabsSchema = new mongoose.Schema({
  collabHeading: {
    type: String,
    required: true,
  },
  collabParagraph: {
    type: String,
    required: true,
  },
  collabSubheading: {
    type: String,
    required: true,
  }
});


const collabCheckPointSchema = new mongoose.Schema({
  checkPointHeading: {
    type: String,
    required: true,
  },
  checkPointParagraph: {
    type: String,
    required: true,
  },
  checkPointUrl: {
    type: String,
    required: true,
  },
});

const Collabs = mongoose.model('collabDetails', collabsSchema);
const CheckPoint = mongoose.model('collabCheckPointDetails', collabCheckPointSchema);

export  {Collabs,CheckPoint};