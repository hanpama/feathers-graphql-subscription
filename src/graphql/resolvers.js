module.exports = function loadResolver() {
  const app = this;

  const messages = app.service('messages');
  const pubsub = app.get('pubsub');

  return {
    Query: {
      messages() { return messages.find().then(res => res.data); }
    },
    Mutation: {
      createMessage(obj, args, context, info) {
        return messages.create({text: args.text}).then(message => {
          pubsub.publish('messageCreated' , message)
          return message;
        });
      }
    },
    Subscription: {
      messageCreated(message) { return message; }
    }
  };

};
