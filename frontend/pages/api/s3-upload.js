import { APIRoute } from "next-s3-upload";
export default APIRoute.configure({
    async key(req, filename) {
      let userId = req.body.userId; 
      let hash = req.body.hash
      console.log(`hash is ${hash}`)
      return `${userId}/${hash}/${filename}`;
    }
  });