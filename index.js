require('dotenv').config();
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const app = express();
const People = require('./models/people')

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
app.use(cors());
app.use(express.static('build'));


const getInfo = (peopleCount) => {
  const summary = `<p>Phonebook has info for ${peopleCount} people</p>`;
  const time = new Date();
  return summary + '<br>' + time.toString();
}

app.get('/api/persons',(req, res, next) => {
  People.find({}).then(people => {
    console.log(people);
    res.json(people);
  })
  .catch(error => next(error))
});

app.get('/info', (req, res, next) => {
  People.find({}).then(people => {
    res.send(getInfo(people.length))
  })
  .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
  People.findByIdAndRemove(req.params.id)
  .then(result => {
    console.log(result);
    res.status(204).end()
  })
  .catch(error => next(error))
});

app.get('/api/persons/:id', (req, res, next) => {
  People.findById(request.params.id)
  .then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  let newPerson = req.body;
  console.log(newPerson);
  person = new People (newPerson);
  person.save()
  .then(savedPerson => res.json(savedPerson))
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  let toBeUpdatedPerson = req.body;
  People.findByIdAndUpdate(req.params.id, toBeUpdatedPerson, { new: true, runValidators: true, context: 'query'})
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error);
}

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})