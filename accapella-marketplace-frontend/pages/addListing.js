import { useState } from 'react';
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
  
  const Forms = () => {
    const [file, setFile] = useState(null);
    const addListing = async event => {
        event.preventDefault();
        const data = {
            name: event.target.name.value,
            key: event.target.key.value,
            bpm: event.target.bpm.value,
            price: event.target.price.value,
            file: event.target.file.value
        }
        console.log("file object is ")
        console.log(file)
    }

    const onFileChange = event => {
     
        // Update the state
        // console.log(event.target.files[0]);
        setFile(event.target.files[0])
       
    };


    return (
      <Row>
        <Col>
          {/* --------------------------------------------------------------------------------*/}
          {/* Card-1*/}
          {/* --------------------------------------------------------------------------------*/}
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-bell me-2"> </i>
              Form Example
            </CardTitle>
            <CardBody>
              <Form onSubmit={addListing}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="name"
                    type="name"
                  />
                </FormGroup>
                <FormGroup>
                <Label for="key">Key</Label>
                  <Input
                    id="key"
                    name="key"
                    placeholder="key"
                    type="name"
                  />
                </FormGroup>

                <FormGroup>
                <Label for="bpm">BPM</Label>
                  <Input
                    id="bpm"
                    name="bpm"
                    placeholder="bpm"
                    type="name"
                  />
                </FormGroup>

                <FormGroup>
                <Label for="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="price"
                    type="name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleFile">File</Label>
                  <Input id="exampleFile" name="file" type="file" onChange={onFileChange}/>
                  <FormText>
                    This is some placeholder block-level help text for the above input. Its a bit
                    lighter and easily wraps to a new line.
                  </FormText>
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
  