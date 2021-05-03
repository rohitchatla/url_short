const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  original_url: {
    type: String,
    index: true,
    unique: true
  },
  short_url: {
    type: String,
    unique: true,
    index: true,
    default: shortid.generate
  }
});

mongoose.model('Url', UrlSchema);
