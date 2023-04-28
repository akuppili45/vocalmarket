import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
  } from 'reactstrap';
import { redirect, useRouter } from 'next/navigation';
import useUser from "../lib/useUser"
import { useState } from "react";
import fetchJson, { FetchError } from "../lib/fetchJson";



  
  const Forms = () => {
    const router = useRouter();
    const { mutateUser } = useUser({
      redirectTo: "/ui/buttons",
      redirectIfFound: true,
    });
    const [errorMsg, setErrorMsg] = useState("");
    const loginUser = async event => {
        event.preventDefault();
        const data = {
            email: event.target.email.value,
            password: event.target.password.value,
        }
        const endpoint = 'http://127.0.0.1:5000/loginWithoutForm';
        console.log(data.email);
        console.log(data.password);
        try {
          mutateUser(
            await fetchJson('/api/login', {
              method: "POST",
              headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              'Access-Control-Allow-Credentials': 'true' },
              body: JSON.stringify(data),
            }),
            false,
          );
        } catch (error) {
          if (error instanceof FetchError) {
            setErrorMsg(error.data.message);
          } else {
            console.error("An unexpected error happened:", error);
          }
        }

        /*
        const JSONdata = JSON.stringify(data);


        const endpoint = 'http://127.0.0.1:5000/loginWithoutForm';

        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
              'Access-Control-Allow-Credentials': 'true'
            },
            // Body of the request is the JSON data we created above.
            body: JSONdata,
            credentials: 'include'
        }
        const response = await fetch(endpoint, options);

        const result = await response.json();
        if(result){
            localStorage.setItem('user', JSON.stringify(result));   
            router.push('/')
        }
        */
        // console.log(result);
    }
    return (
      <Row>
        <Col>
          {/* --------------------------------------------------------------------------------*/}
          {/* Card-1*/}
          {/* --------------------------------------------------------------------------------*/}
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-bell me-2"> </i>
              Login
            </CardTitle>
            <CardBody>
              <Form onSubmit={loginUser}>
                <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    placeholder="with a placeholder"
                    type="email"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Password</Label>
                  <Input
                    id="examplePassword"
                    name="password"
                    placeholder="password placeholder"
                    type="password"
                  />
                </FormGroup>
                <Button>Submit</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };
  
  export default Forms;
  