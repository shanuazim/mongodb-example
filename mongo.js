const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')

const url = 'mongodb://localhost:27017/test'

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

mongodb.MongoClient.connect(url, (error, db) => {
  if (error) return process.exit(1)

  app.get('/messages', (req,res,next) => {
      db.collection('messages')
      .find({}, {sort: {_id:-1}})
      .toArray((error, messages)=> {
          if (error) return next(error)
          res.send(messages)
      })
  })

  app.get('/messages/:id', (req,res,next) => {
      db.collection('messages')
      .find({_id: mongodb.ObjectID(req.params.id)}, {sort: {_id: -1}})
      .toArray((error, messages) => {
          if (error) return next(err0r)
          res.send(messages)
      })
  })

  app.post('/messages', (req,res, next) => {
      let newMessage = req.body
      db.collection('messages')
      .insert(newMessage, (error, results) => {
        if (error) return next(error)
        res.send(results)
      })
  })

  app.put('/messages/:id', (req, res, next) => {
    db.collection('messages')
      .update({_id: mongodb.ObjectID( req.params.id)}, {$set: req.body}, (error, results) => {
     if (error) return next(error)
     res.send(results)
    })
   })
   app.delete('/messages/:id', (req, res, next) => {
    db.collection('messages')
    .remove({_id:mongodb.ObjectID( req.params.id)}, (error, results) => {
     if (error) return next(error)
     res.send(results)
    })
   })
   app.use(errorhandler())
   app.listen(3000)
 })
