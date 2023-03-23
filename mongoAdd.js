const res = require('express/lib/response');
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url =
  `mongodb+srv://JingZhu:${password}@cluster0.8gbjs74.mongodb.net/thePhoneApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
      return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'A number is required']
  }
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then(persons => {
  if (process.argv.length === 3) {
    console.log('Phonebook:');
    persons.forEach(person => {
      console.log(person.name, person.number);
      mongoose.connection.close();
    })
  } else if (process.argv.length === 5) {
    const person = new Person ({
      name: newName,
      number: newNumber
    })
    person.save().then((result) => {
      console.log(`Added ${result.name} ${result.number} to the phone book`);
      mongoose.connection.close();
    })
  }
})
