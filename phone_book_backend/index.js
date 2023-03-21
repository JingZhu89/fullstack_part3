const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.json());
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body[0])
  ].join(' ')
}));

let data =
[
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

const getInfo = () => {
  const summary = `<p>Phonebook has info for ${data.length} people</p>`;
  const time = new Date();
  return summary + '<br>' + time.toString();
}

function getRandomInt() {
  return Math.floor(Math.random() * 100000);
}

app.get('/api/persons',(req, res) => {
  res.json(data);
});

app.get('/info', (req, res) => {
  res.send(getInfo());
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const newPersons = data.filter(p => p.id !== id);
  if (data.length === newPersons.length) {
    res.status(404).end();
  } else {
    data = newPersons;
    res.status(204).end();
  }
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = data.filter(p => p.id === id);
  if (person.length === 0) {
    res.status(404).end();
  } else {
    res.json(person);
  }
});

app.post('/api/persons', (req, res) => {
  let newPerson = req.body;
  if (inValidName(newPerson)) {
    return res.status(400).json({
      error: inValidName(newPerson)
    })
  }
  newPerson[0].id = getRandomInt();
  data = data.concat(newPerson);
  res.json(newPerson);
})

const inValidName = (newData) => {
  const allNames = data.map(person => person.name);
  const newName = newData[0].name;
  const newNumber = newData[0].number;
  if (!newName || !newNumber) {
    return 'must provide name and number';
  } else if (allNames.includes(newName)) {
    return 'name must be unique';
  } else {
    return false
  }
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});