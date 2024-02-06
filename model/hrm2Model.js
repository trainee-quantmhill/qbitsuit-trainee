import mongoose from 'mongoose';

const Hrm2Schema = new mongoose.Schema({
  hrm2Heading: {
    type: String,
    required: true,
  },
  hrm2Subheading: {
    type: String,
    required: true,
  },
  hrm2Url: {
    type: String,
    required: true,
  },
});

const hrm2AccordianSchema = new mongoose.Schema({
  accordian_2Heading: {
    type: String,
    required: true,
  },
  accordian_2Paragraph: {
    type: String,
    required: true,
  }
});

const Hrm2 = mongoose.model('hrm2Details', Hrm2Schema);
const Hrm2Accordian = mongoose.model('hrm2Accordian', hrm2AccordianSchema);

export { Hrm2, Hrm2Accordian };
