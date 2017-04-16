'use strict';

// Initializes the `graphql` service on path `/graphql`
// const createService = require('./graphql.class.js');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const { PubSub, SubscriptionManager } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const Resolvers = require('./resolvers');
const Schema = require('./schema');

const pubsub = new PubSub();
let executableSchema;
let subscriptionManager;

const configGraphql = function () {
  const app = this;
  app.set('pubsub', pubsub);

  executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(app)
  });


  app.use('/graphql', graphqlExpress((req) => {
    let {token, provider} = req.feathers;
    return {
      schema: executableSchema,
      context: {
        token,
        provider
      }
    };
  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://${app.get('host')}:${app.get('port')}/subscriptions`,
  }));

  subscriptionManager = new SubscriptionManager({
    schema: executableSchema,
    pubsub: pubsub,
  });
};

const runSubscriptionServer = function (server) {
  return new SubscriptionServer(
    { subscriptionManager },
    { server: server, path: '/subscriptions' }
  );
};

module.exports = {
  runSubscriptionServer, configGraphql, pubsub
};
