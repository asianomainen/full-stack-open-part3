const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('content', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook frontend</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(
            '<p>Phonebook has info for ' + persons.length + ' people</p>'
            + '<p>' + new Date() + '</p>')
    })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    /*    if (!body.name || !body.number) {
            return response.status(400).json({
                error: 'Name or number missing'
            })
        }

        const duplicate = persons.find(person => person.name === body.name)

        if (duplicate) {
            return response.status(400).json({
                error: 'Name must be unique'
            })
        }*/

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
    console.log(`Server running on port ${PORT}`)
})
