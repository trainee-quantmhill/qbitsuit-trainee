
import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  moduleHeading: {
    type: String,
    required: true,
  },
  moduleSubheading: {
    type: String,
    required: true,
  }
});

const accountSchema = new mongoose.Schema({
    accountHeading: {
      type: String,
      required: true,
    },
    accountSubheading: {
      type: String,
      required: true,
    },
    accountImageUrl: {
        type: String,
        required: true,
    }
});

const accordianSchema = new mongoose.Schema({
    accordianHeading: {
      type: String,
      required: true,
    },
    accordianParagraph: {
      type: String,
      required: true,
    }
});
  
const Module = mongoose.model('moduleDetail', moduleSchema);
const Account = mongoose.model('accountDetails', accountSchema);
const Accordian = mongoose.model('accordianDetail', accordianSchema);

export {Module,Account,Accordian};