const { application } = require("express")
const express = require("express")
var morgan = require("morgan")
const cors = require("cors")
const app = express()

morgan.token('personBody', (req) => console.log(req.body))

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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p =>  p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get("/api/persons", (_request, response) => {
  response.json(persons)
})

const numberOfEntries = persons.length

app.get("/info", (_request, response) => {
    response.send(`Phonebook has info for ${numberOfEntries} people<br /><br />${Date()}`)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.floor(Math.random(...persons.map(p => p.id)) * 400)
    : 0
  return maxId
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and number must be filled"
    })
  }

  if (persons.find(p => p.name === body.name)) {
    console.log("hello")
    return response.status(400).json({
      error: "please enter a unique name"
    })

  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})