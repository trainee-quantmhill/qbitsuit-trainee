import mongoose from 'mongoose';

const Hrm1Schema = new mongoose.Schema({
  hrmHeading: {
    type: String,
    required: true,
  },
  hrmSubheading: {
    type: String,
    required: true,
  },
  hrmUrl: {
    type: String,
    required: true,
  },
});

const hrmAccordianSchema = new mongoose.Schema({
  accordian_1Heading: {
    type: String,
    required: true,
  },
  accordian_1Paragraph: {
    type: String,
    required: true,
  }
});

const Hrm1 = mongoose.model('hrmDetails', Hrm1Schema);
const HrmAccordian = mongoose.model('hrmAccordian', hrmAccordianSchema);

export { Hrm1, HrmAccordian };
