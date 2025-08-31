/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tourManagement:5SWZuOQohiWbm1zM@cluster0.mcynqnr.mongodb.net/tourManagementDB?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("Successfully connected to database");

    server = app.listen(envVars.PORT, () => {
      console.log(`Tour Management Server is listening to port ${envVars.PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
};


(async() =>{
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})()

process.on("unhandledRejection", (error) =>{
  console.log("Unhandled Rejection Detected. Server is shutting down....", error);

  if(server){
    server.close(() =>{
      process.exit(1);
    })
  };

  process.exit(1);

})

process.on("uncaughtException", (error) =>{
  console.log("Uncaught Exception Detected. Server is shutting down....", error);

  if(server){
    server.close(() =>{
      process.exit(1);
    })
  };

  process.exit(1);

})

process.on("SIGTERM", () =>{
  console.log("SIGTERM signal received. Server is shutting down....");

  if(server){
    server.close(() =>{
      process.exit(1);
    })
  };

  process.exit(1);

})

process.on("SIGINT", () =>{
  console.log("SIGINT signal received. Server is shutting down....");

  if(server){
    server.close(() =>{
      process.exit(1);
    })
  };

  process.exit(1);

})


// Unhandled Rejection Error:
// Promise.reject(new Error("I forgot to catch the promise"))

// Uncaught Exception Error: 
// throw new Error("I forgot to handle Uncaught Exception error")




