import Head from "next/head";
import { Col, Row } from "reactstrap";
import ProjectTables from "../src/components/dashboard/ProjectTable";
import useSWR from 'swr';
import Sidebar from "../src/layouts/sidebars/vertical/Sidebar";
import SearchBar from "../src/layouts/sidebars/vertical/SearchBar";
import { useEffect, useState } from "react";
import useUser from "../lib/useUser";
import BoughtTable from "../src/components/dashboard/BoughtTable";


const fetcher = (url) => fetch(url).then((res) => res.json());



export default function BoughtListings() {
  const { user } = useUser();
  const userID = user?.userData?.id
  const apiUrl = `http://127.0.0.1:5000/getBoughtAccapellas/${userID}`;

  console.log(user);
  const { data: itemsData, error } = useSWR(userID ? apiUrl : null, fetcher, {revalidateOnFocus: false});
  const [tempListings, setTempListings] = useState([]);
  useEffect(() => {
    if(itemsData){
      setTempListings(itemsData);
    }
    
  }, [itemsData])
  console.log(tempListings);
  if (!user || !itemsData) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <div  className="pageWrapper d-md-block d-lg-flex">
      
        <Head>
            <title>Accapella Marketplace</title>
            <meta
            name="description"
            content="Accapella Marketplace"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="contentArea">
            {/***Sales & Feed***/}
            {/* <Row>
            <Col sm="12" lg="6" xl="7" xxl="8">
                <SalesChart />
            </Col>
            <Col sm="12" lg="6" xl="5" xxl="4">
                <Feeds />
            </Col>
            </Row> */}
            {/***Table ***/}
            <Row>
            <Col lg="12" sm="12">

              {/* <div>bought page</div> */}
              <BoughtTable data={itemsData.bought}/>
            </Col>
            </Row>
            {/***Blog Cards***/}
            {/* <Row>
            {BlogData.map((blg) => (
                <Col sm="6" lg="6" xl="3" key={blg.title}>
                <Blog
                    image={blg.image}
                    title={blg.title}
                    subtitle={blg.subtitle}
                    text={blg.description}
                    color={blg.btnbg}
                />
                </Col>
            ))}
            </Row> */}
        </div>
        </div>
    </div>
    
  );
}