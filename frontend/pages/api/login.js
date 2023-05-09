import { withIronSessionApiRoute } from "iron-session/next";
import fetchJson from "../../lib/fetchJson";
import { sessionOptions } from "../../lib/session";

export default withIronSessionApiRoute(async (req, res) => {
  const { email, password } = await req.body;
  const JSONdata = JSON.stringify({
    email,
    password
    });
  try {

    const endpoint = 'http://localhost:5000/loginWithoutForm';

    const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            // Body of the request is the JSON data we created above.
            body: JSONdata,
    }
    console.log(`email from api/login is ${email} and password is ${password}`)

    const login = await fetchJson(endpoint, options);
    console.log(login);
    const userData = {id: login.id, username: login.username}
    // const {
    //   data: { login, avatar_url },
    // } = await octokit.rest.users.getByUsername({ username });

    const user = { isLoggedIn: true, userData };
    // localStorage.setItem('user', user);   
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}, sessionOptions);
