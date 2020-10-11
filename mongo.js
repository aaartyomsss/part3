const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://artjomsa:${password}@cluster0.ixjfn.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
})

const Person = mongoose.model('Person', personSchema)


if (!process.argv[3] && !process.argv[4]) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    // Creating a new person obj
    const person = new Person({
        name: process.argv[3],
        phone: process.argv[4]
    })

    // Saving person obj to the db
    person.save().then(result => {
        console.log(`added ${person.name} ${person.phone} to phonebook`)
        mongoose.connection.close()
    })
}