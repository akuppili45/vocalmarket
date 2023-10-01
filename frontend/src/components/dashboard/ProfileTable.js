import Image from "next/image";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";

import { useState, useEffect } from "react";
import useUser from "../../../lib/useUser";


const tableData = [
  {
    avatar: user1,
    name: "Jonathan Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user2,
    name: "Martin Gover",
    email: "hgover@gmail.com",
    project: "Lading pro React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user3,
    name: "Gulshan Gover",
    email: "hgover@gmail.com",
    project: "Elite React",
    status: "holt",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user4,
    name: "Pavar Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user5,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Ample React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
];


const ProfileTable = ({ data, isOwnProfile, currentUser, title }) => {
  
  console.log(data);
  const downloadTxtFile = (name) => {
    const element = document.createElement("a");
    element.href = `https://audio-files-music.s3.us-west-1.amazonaws.com/${name}`;
// simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">{title}</CardTitle>
        <div className="table-responsive">
          <Table className="text-nowrap mt-3 align-middle" borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Original Owner</th>
                <th>Download</th>

                
              </tr>
            </thead>
            <tbody>
              {data?.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    {tdata.aca.accapella.name}
                  </td>
                  <td>
                    <a href={`/profileView/${tdata.user_id}`}>{tdata.username}</a>
                  </td>
                  <td>   
                    {isOwnProfile ? (
                    <div className="btnDiv">
                        <button id="downloadBtn" onClick={() => downloadTxtFile(tdata.aca.accapella.s3Path)} value="download">Download</button>
                    </div>
                    ) : (
                        <form action={`http://127.0.0.1:5000/create-checkout-session/${currentUser}/${tdata.price.id}/${tdata.aca.accapella.name}/${tdata.user_id}/${tdata.listing_id}/${tdata.aca.accapella.s3Path.replaceAll('/', ',')}`} method="POST">
                      <button style={{ background: '#556cd6', height: 36, borderRadius: 4, color: 'white', marginTop: 20 }} type="submit" role="link">Checkout</button>
                    </form>
                    )}   
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileTable;
