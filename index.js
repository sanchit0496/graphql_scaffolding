const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const sequelize = require('./config/database');

const app = express();


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL in development
}));
  
app.listen(3000, () => console.log('Server running on port 3000'));
