import { withIronSessionApiRoute } from "iron-session/next";
import fetchJson from "../../lib/fetchJson";
import { sessionOptions } from "../../lib/session";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

async function logoutRoute(req, res) {
    console.log("in logout route")
    const endpoint = 'http://localhost:5000/logout';
        const options = {
            // The method is POST because we are sending data.
            method: 'GET',
            // Tell the server we're sending JSON.
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            },
            credentials: "same-origin",
            mode: 'cors',
            withCredentials: true
            // Body of the request is the JSON data we created above.
        }
        await fetchJson(endpoint, options);
    // localStorage.removeItem('user');
    req.session.destroy();
    res.json({ isLoggedIn: false, login: ""});
}
