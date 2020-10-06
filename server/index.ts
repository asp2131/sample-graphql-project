import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// import Redis from "ioredis";
// import session from "express-session";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import {UserResolver} from "./resolvers/UserResolver"; 
// import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: "postgresql://ulnmey4j2kgpe9k45mtz:MGlziUJpsaLDAGYNCnb3@brbpvg72wcxztaxjapif-postgresql.services.clever-cloud.com:5432/brbpvg72wcxztaxjapif",
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
    entities: [Post, User]
  });


  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000/',
      credentials: true,
    })
  );


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      // redis,
    
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(3000, () => {
    console.log("server started on localhost:3000");
  });
};

main().catch((err) => {
  console.error(err);
});