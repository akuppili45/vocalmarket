export default async function fetchJson(input, init) {
    try{
      const response = await fetch(input, init);
      // if the server replies, there's always some data in json
      // if there's a network error, it will throw at the previous line
      console.log(response);
      const data = await response.json();
      console.log(response);

      // console.log(response.ok);
      // response.ok is true when res.status is 2xx
      // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
      if (response.ok) {
        return data;
      }
    } catch(error){
      throw new FetchError({
        message: error,
      });
    }
  }
  
  export class FetchError extends Error {
    response;
    data;
    constructor({ message, response, data }) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(message);
  
      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, FetchError);
      }
      this.name = "FetchError";
      this.response = response;
      this.data = data ?? { message: message };
    }
  }
  