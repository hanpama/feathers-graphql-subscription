# apollo-feathers

Feathers example with apollo graphql subscription

Minimal example to show how to connect apollo graphql subscription
to feathers services.

![screenshot](./screenshot.png)

```graphql
mutation {
  createMessage(text: "New Message!") {
    text
  }
}
```

```graphql
subscription {
  messageCreated {
    text
  }
}
```