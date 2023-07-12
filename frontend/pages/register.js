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

  const Register = () => {
    const router = useRouter();
    const { mutateUser } = useUser({
      redirectTo: "/",
      redirectIfFound: true,
    });
    const [errorMsg, setErrorMsg] = useState("");
    const registerUser = async event => {
        event.preventDefault();
        if (event.target.password.value !== event.target.confirmPassword.value) {
            alert(`Passwords ${event.target.password.value} and ${event.target.confirmPassword.value} do not match!`);
            return;
        } 
        const data = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value,
        }
        console.log(data.email);
        console.log(data.password);
        try {
          mutateUser(
            await fetchJson('/api/register', {
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
              Register
            </CardTitle>
            <CardBody>
              <Form onSubmit={registerUser}>
              <FormGroup>
                  <Label for="exampleEmail">Username</Label>
                  <Input
                    id="exampleEmail"
                    name="username"
                    placeholder="with a placeholder"
                    type="username"
                  />
                </FormGroup>
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
                <FormGroup>
                  <Label for="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    name="confirmPassword"
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
  
  export default Register;
  