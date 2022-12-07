require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json()) // after can use request.body

app.use(morgan('combined'))
morgan.token('body', (req, ) => JSON.stringify(req.body))
const requestLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]',
)
app.use(requestLogger)

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
let persons = []

app.get('/', (response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (response) => {
  console.log('------------------------------------------------------------')
  var start = new Date()
  console.log(start)
  response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${start}</div>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (response) => {
  Person.find({}).then((persons) => {
    console.log(persons)
    response.json(persons)
  })
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const generateId = () => {
  const randomId = getRandomInt(100000)
  if (persons.find(({ id }) => id === randomId)) {
    return generateId()
  } else {
    return randomId
  }
}
console.log(`generateId: ${generateId()}`)

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(JSON.stringify(request.body))

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  })

  person
    .save()
    .then((savePerson) => {
      response.json(savePerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) // must be the end of the last route

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name == 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
