const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

/*console.log('Please provide missing argument(s): node mongo.js <password>(required) <name>(optional) ' +
    '<number>(optional, but required if name entered)')*/

const password = process.argv[2]

const url =
    `mongodb+srv://asianomainen:${password}@cluster0.jgbe2.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 5) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    contact.save().then(result => {
        console.log('added', contact.name, 'number', contact.number, 'to phonebook')
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
}
