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
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then(result => {
    console.log(result);
  mongoose.connection.close()
})