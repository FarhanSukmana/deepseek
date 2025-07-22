import mongoose from "mongoose";

let cache = global.mongoose || {conn:null, promise:null}

export default async function connectDB(){
  if(cache.conn) return cache.conn
  if(!cache.promise){
    cache.promise = mongoose.connect(process.env.MONGODB_URLMONGODB_URL).then((mongoose)=>{mongoose}
    );
  }

  try {
      cache.conn = await cache.promise;
  } catch (error) {
    console.log("Error connecting to MongoDb", error)
  }

  return cache.conn
}