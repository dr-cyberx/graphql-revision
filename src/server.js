import { GraphQLServer } from "graphql-yoga";
import { demoUsers } from "../data/DemoUser";
import { Post } from "../data/DemoPost";
import { Comments } from "../data/DemoComments";

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
    me: String!
    users(query:String): [User]!
    posts(query: String): [Post]!
    comments(query: String): [Comment]!
  }

  type Comment{
    id: ID!
    textField: String!
    author: User!
  }

  type User{
    id: ID!
    name: String!
    age: Int!
    email: String!
    posts: [Post]!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
  Query: {
    me: () => "hello world",
    users(_parent, args, ctx, info) {
      if (!args.query) {
        return demoUsers;
      }
      return demoUsers.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },

    posts(_parent, args, ctx, info) {
      if (!args.query) {
        return Post;
      }

      return Post.filter((post) =>
        post.title.toLowerCase().includes(args.query.toLowerCase())
      );
    },

    comments(_parents, args, ctx, info) {
      if (!args.query) {
        return Comments;
      }

      return Comments.filter((cmnt) =>
        cmnt.textField.toLowerCase().includes(args.query.toLowerCase())
      );
    },
  },

  Post: {
    author(_parents, args, ctx, info) {
      return demoUsers.find((user) => user.id === _parents.author);
    },
  },

  User: {
    posts(_parents, args, ctx, info) {
      return Post.filter((post) => post.author === _parents.id);
    },
  },
  Comment: {
    author(_parents, args, ctx, info) {
      return demoUsers.find((user) => user.id === _parents.author);
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
