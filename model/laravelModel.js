

import mongoose from 'mongoose';


const laravelSchema = new mongoose.Schema({
    laravelHeading: {
      type: String,
      required: true,
    },
    laravelSubheading: {
      type: String,
      required: true,
    },
    laravelUrl: {
      type: String,
      required: true,
    },
  });

  const Laravel = mongoose.model('laravelDetails', laravelSchema);
  export default Laravel;