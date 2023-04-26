import Image from "next/image";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";

import { useState } from "react";



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



const ProjectTables = ({ data }) => {
  if(!data){
    return (<div></div>);
  }
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Project Listing</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Overview of the projects
        </CardSubtitle>
        <div className="table-responsive">
          <Table className="text-nowrap mt-3 align-middle" borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Play</th>
                <th>Key</th>

                <th>BPM</th>
                <th>Price</th>
                <th>Topic</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-2">
                      {/* <Image
                        src={tdata.avatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      /> */}
                      <div className="ms-3">
                        <h6 className="mb-0">{tdata.aca.accapella.name}</h6>
                        <span className="text-muted">{tdata.user_id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <audio controls src={`https://audio-files-music.s3.us-west-1.amazonaws.com/${tdata.aca.accapella.s3Path}`} preload="auto" id="audio_player" type="audio/mp3">
</audio>
                  </td>
                  <td>{tdata.aca.accapella.key}</td>
                  <td>{tdata.aca.accapella.bpm}</td>
                  <td>{tdata.price}</td>
                  <td>{tdata.aca.accapella.topics[1]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProjectTables;
