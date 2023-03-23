const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];

const url =
  `mongodb+srv://JingZhu:${password}@cluster0.8gbjs74.mongodb.net/thePhoneApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: "Ada Lovelace", 
  number: "39-44-5323523",
})

person.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})