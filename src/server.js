import { GraphQLServer } from "graphql-yoga";
import db from "../db/Index";

// graphqlServer => (type Definitions/schema) and resolvers
//scalar types => string, boolean, int, float, id
// greeting(name: String!, position: String!) : String!
// add(num1: Int!, num2: Int!) : Float!
// grades: [Int!]!
// greeting: (parent, _args) =>
//   `hello ${_args.name} and you are a ${_args.position}`, //(parent, args, context, info)
// add: (parent, _args) => _args.num1 + _args.num2,
// grades: (parent, _args, context, info) => [50, 60, 40, 20, 90, 10],

const resolvers = {
  Query: {
    me: () => "hello world",
    users(_parent, args, { db }, info) {

      if (!args.query) {
        return demoUsers;
      }
      return db.demoUsers.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },

    posts(_parent, args, { db }, info) {
      if (!args.query) {
        return db.Post;
      }

      return db.Post.filter((post) =>
        post.title.toLowerCase().includes(args.query.toLowerCase())
      );
    },

    comments(_parents, args, { db }, info) {
      if (!args.query) {
        return db.Comments;
      }

      return db.Comments.filter((cmnt) =>
        cmnt.textField.toLowerCase().includes(args.query.toLowerCase())
      );
    },
  },

  Post: {
    author(_parents, args, { db }, info) {
      console.log("parents =>>> ", _parents);
      return db.demoUsers.find((user) => user.id === _parents.author);
    },
  },

  User: {
    posts(_parents, args, { db }, info) {
      return db.Post.filter((post) => post.author === _parents.id);
    },
  },
  Comment: {
    author(_parents, args, { db }, info) {
      return db.demoUsers.find((user) => user.id === _parents.author);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql", // use of shorthand
  resolvers,
  context: {
    db,
  },
});

server.start(() => {
  console.log("the server is up!");
});
