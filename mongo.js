const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
  important: Boolean,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3]) {
  mongoose
    .connect(url)
    .then(() => {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        date: new Date(),
        important: true,
      })
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      return person.save()
    })
    .then(() => {
      return mongoose.connection.close()
    })
    .catch((err) => console.log('myerror', err))
} else {
  console.log('phonebook:')
  mongoose.connect(url).then(() =>
    Person.find({})
      .then((result) => {
        result.forEach((person) => {
          console.log(`${person.name}  ${person.number}`)
        })
        mongoose.connection.close()
      })
      .catch((err) => console.log(err)),
  )
}
