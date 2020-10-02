const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

//
app.use(cors())

app.use(express.static('build'))

//json-parser
app.use(express.json())

//Token for sending body
morgan.token('body', (req, res) => JSON.stringify(req.body))


// Morgan middleware
// response format : method/url/status/res/res-time
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Function for generating random id
const generateId = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-156326"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "654964846468"
    },
    {
        id: 3,
        name: "Michael Jordan",
        number: "48468465464"
    },
    {
        id: 4,
        name: "Diego Costa",
        number: "7888548-658"
    }
  ]


// Getting additional info
app.get('/info', (req, res) => {
    const date = new Date()
    const num = persons.length
    res.send(`<h1>Phonebook has ${num} people</h1><br/>
    <p>${date}<p>
    `)
})


// Getting all persons list
app.get('/api/persons', (req, res) => {
  console.log(req.body)
  res.json(persons)
})

//Fetching a single resource
app.get('/api/persons/:id', (req, res) =>{
  const id = Number(req.params.id)
  const person = persons.find(obj => obj.id === id)
  
  //If persons doesn't exist
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }

})

//Deleting by resource by id
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end
})

//Adding person
app.post('/api/persons/', (req, res) => {
  const body = req.body
  let exists = false
  
  // Checking resource for existance
  persons.forEach(person => {
    if (person.name === body.name) {
      exists = true
    }
  })

  if (!body.name || !body.phone) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }
  if (exists) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: generateId(5, 10000),
    name: body.name,
    numebr: body.number
  }

  persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})