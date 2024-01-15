const express = require("express");
const { ApolloServer } = require('apollo-server-express');
const schema = require("./schema/schema");
const logger = require("./logger"); // Make sure the path is correct
const { applyMiddleware } = require('graphql-middleware');
const { connectKafkaProducer } = require('./kafka/kafkaProducer');

const app = express();

const loggingMiddleware = (resolve, root, args, context, info) => {
    const { fieldName, returnType } = info;
    logger.info(`Query/Mutation: ${fieldName}, Return Type: ${returnType}`);
    try {
      const result = resolve(root, args, context, info);
  
      if (result instanceof Promise) {
        return result.catch(err => {
          logger.error(`Error in ${fieldName}: ${err}`);
          throw err;
        });
      }
  
      return result;
    } catch (err) {
      logger.error(`Error in ${fieldName}: ${err}`);
      throw err;
    }
  };
  

const schemaWithMiddleware = applyMiddleware(schema, loggingMiddleware);
const apolloServer = new ApolloServer({ schema: schemaWithMiddleware });

async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Connect Kafka producer
  await connectKafkaProducer();

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000' + apolloServer.graphqlPath);
  });
}
startServer()
// Connect to Kafka when starting the service
connectKafkaProducer().catch(console.error);