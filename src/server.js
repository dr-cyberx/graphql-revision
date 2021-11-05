import { GraphQLServer } from "graphql-yoga";
import { demoUsers } from "../data/DemoUser";

// graphqlServer => (type Definitions/schema) and resolvers
//scalar types => string, boolean, int, float, id
// greeting(name: String!, position: String!) : String!
// add(num1: Int!, num2: Int!) : Float!
// grades: [Int!]!
// greeting: (parent, _args) =>
//   `hello ${_args.name} and you are a ${_args.position}`, //(parent, args, context, info)
// add: (parent, _args) => _args.num1 + _args.num2,
// grades: (parent, _args, context, info) => [50, 60, 40, 20, 90, 10],

const typeDefs = `
  type Query{
    users: [User!]!
    me: User!
    findByLetter(query: String): [User]
    post: Post!
  }

  type User{
    id: ID!
    name: String!
    age: Int!
    email: String!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    findByLetter(_parent, args, context, info) {
      if (!args.query) {
        return demoUsers;
      }
      return demoUsers.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    users(_parents, args, context, info) {
      return demoUsers;
    },
    me() {
      return {
        id: "sdfasdfasdf",
        name: "Vishal",
        age: 23,
        email: "drcyberx@gmail.com",
      };
    },
    post() {
      return {
        id: "safasdfasdf",
        title: "Graphql 101",
        body: "this is dummy body for this post",
        published: true,
      };
    },
  },
};

const server = new GraphQLServer({
  typeDefs, // use of shorthand
  resolvers,
});

server.start(() => {
  console.log("the server is up!");
});
