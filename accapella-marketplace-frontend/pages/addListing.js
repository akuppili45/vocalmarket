import { useEffect, useState } from 'react';
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
import { CryptoJS } from '../tools/md5';
import { useS3Upload } from "next-s3-upload";

  
  const Forms = () => {
    const [file, setFile] = useState(null);
    const [md5, setMd5] = useState(null);
    const [num, setNum] = useState(0);
    let { uploadToS3 } = useS3Upload();

    // console.log(md5);
    const addListing = async event => {
        event.preventDefault();
        const data = {
            name: event.target.name.value,
            key: event.target.key.value,
            bpm: event.target.bpm.value,
            price: event.target.price.value
        }
        // console.log(file);
        // console.log(md5);

        // const reader = new FileReader();
        // reader.onload = function(e) {
        //     e.preventDefault();
        //     // console.log("inside file reading")
        //     const binary = event.target.result;
        //     console.log(binary);
        //     setMd5(CryptoJS.MD5(binary).toString());
        //     // console.log(md5)
        // };
        // reader.readAsBinaryString(file);
        // // console.log(md5);
        const user = JSON.parse(localStorage.getItem('user'));
        const s3Path = user.id + '/' + md5 + '/';
        console.log(s3Path);
        try{
            await uploadToS3(file);
        } catch(error){
            console.log(error)
        }
        
    }

    const onFileChange = event => {
        event.preventDefault();
        // Update the state
        // console.log(event.target.files[0]);
        setFile(event.target.files[0]);
        const tempFile = event.target.files[0];
        // console.log(tempFile);
        const reader = new FileReader();
        reader.onload = function(e) {
            e.preventDefault();
            // console.log("inside file reading")
            const binary = e.target.result;
            // console.log(binary);
            setMd5(CryptoJS.MD5(binary).toString());
            // console.log(md5)
        };
        reader.readAsBinaryString(tempFile);
        // console.log(num);
       
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
  