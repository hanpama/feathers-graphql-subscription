module.exports = `
type Message {
  text: String
}

type Query {
  messages: [Message]
}

type Subscription {
  messageCreated: Message
}

type Mutation {
  createMessage(text: String): Message
}
`;
