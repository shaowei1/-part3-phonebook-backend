require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log(`connected to MongoDB, ${result}`)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    require: true,
  },
  number: {
    type: String,
    min: [8, 'Must has length of 8 or more, got {VALUE}'],
    validate: {
      validator: function (v) {
        return /\d{3}-\d/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    require: [true, 'Person number required'],
  },
  date: Date,
  important: Boolean,
})
PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Person', PersonSchema)
