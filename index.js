require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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

// Getting additional info
// app.get('/info', async (req, res) => {
//   const date = new Date()
//   let num = await Person.find({}).then((result, e) => {
//     if (e) {
//       console.log('Error: ', e.message)
//     } else {
//       num = result.length
//       console.log(num)
//     }
//   })

//   res.send(`<h1>Phonebook has ${num} people</h1><br/>
//     <p>${date}<p>
//     `)
// })


// Getting all persons list
app.get('/api/persons', (req, res) => {

  Person.find({}).then((result, e) => {
    if (e) {
      console.log('Error: ', e.message)
    } else {
      console.log(result)
      res.json(result)
    }
  })

  console.log(req.body)

})

//Fetching a single resource
app.get('/api/persons/:id', (req, res, next) =>
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
    .catch(e => next(e))
)


//Adding person
app.post('/api/persons/', (req, res, next) => {
  const body = req.body
  console.log(body)
  if (!body.name || !body.phone) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone
  })

  console.log(person)

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())

  })
    .catch(e => next(e))
})

//Deleting a contact
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      console.log(result)
      res.status(204).end()
    })
    .catch(e => next(e))
})

//Updating a contact
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    phone: body.phone
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(e => next(e))
})


const errorHandler = (e, req, res, next) => {
  console.log(e.name)

  if (e.name === 'CastError' && e.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message })
  } else if (e.name === 'MongoError') {
    return res.status(400).send({ error: 'Such contact already exists' })
  }

  next(e)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})