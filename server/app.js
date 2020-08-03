const express = require('express')
const {graphqlHTTP} = require('express-graphql')

const mongo = require('mongoose')
const app = express()

mongo.connect('mongodb+srv://serg:7adUxHaHx22jrD0V@cluster1.mtpb8.mongodb.net/test',
     {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false
     })

     mongo.connection.once('open', () => {
         console.log('Base online')
     })
     mongo.connection.on('error', () => {
        console.log(`Connection error: ${err}`)
    })

     app.use('/graphql', graphqlHTTP ({ schema: require ('../schema/schema.js'),
        graphiql:true
         
    }))

    app.listen(3000, () => {
        console.log('Server started')
    })