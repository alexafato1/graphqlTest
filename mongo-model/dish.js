const mongo = require('mongoose')
const Schema = mongo.Schema

const dishScheama = new Schema ({
    name: String,
    country: String,
    tasty: Boolean,
    chefsId: String
})

module.exports = mongo.model('Dish', dishScheama)