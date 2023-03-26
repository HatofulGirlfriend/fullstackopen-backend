require("dotenv").config()
const { application } = require("express")
const express = require("express")
var morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")

morgan.token('personBody', (req) => console.log(req.body))

app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(morgan(":personBody"))
app.use(cors())
app.use(express.static("build"))

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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })

  if (Person) {
    response.json(Person)
  } else {
    response.status(404).end()
  }
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})