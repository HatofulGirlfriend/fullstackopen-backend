require("dotenv").config()
const { application } = require("express")
const express = require("express")
var morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")

morgan.token('personBody', (req) => console.log(req.body))

app.use(express.static("build"))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(morgan(":personBody"))
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "34-94-273649",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Beanie Hermenault",
        "number": "39-48-375806",
        "id": 5
      }
]

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get("/api/persons", (_request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

const numberOfEntries = persons.length

app.get("/info", (_request, response) => {
    response.send(`Phonebook has info for ${numberOfEntries} people<br /><br />${Date()}`)
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    console.log(error)
    response.status(400)
  })
})


app.post("/api/persons", (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: "name & number must be filled"})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id"})
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})