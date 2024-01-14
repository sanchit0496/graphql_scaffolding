const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const sequelize = require("./config/database");
const logger = require("./logger"); // Make sure the path is correct
const { applyMiddleware } = require('graphql-middleware');

const app = express();

const loggingMiddleware = (resolve, root, args, context, info) => {
    const { fieldName, returnType } = info;
    console.log('info', info)
    logger.info(`Query/Mutation: ${fieldName}, Return Type: ${returnType}`);
    console.log('inside middleware')
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

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemaWithMiddleware,
    graphiql: true, // Enable GraphiQL in development
  })
);

app.listen(3001, () => console.log("Server running on port 3001"));
