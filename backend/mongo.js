const mongoose = require("mongoose")


const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
`mongodb+srv://tonipatsias:${password}
@phonebookdb.ly3qels.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.set("strictQuery",false)
console.log(url)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
    name: personName,
    number: personNumber,
})

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
    } else {
    person.save().then(result => {
        console.log(`added ${personName} to phonebook`)
        mongoose.connection.close()
    })
}
