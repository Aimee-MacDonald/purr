const mongoose = require("mongoose")
const Schema = mongoose.Schema

var schema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  image: {type: String, required: true},
  external_url: {type: String, required: true},
  background_color: {type: String, required: true}
})

module.exports = mongoose.model("purrNFT", schema)