import Head from "next/head";
import { Col, Row } from "reactstrap";
import ProjectTables from "../src/components/dashboard/ProjectTable";
import useSWR from 'swr';
import Sidebar from "../src/layouts/sidebars/vertical/Sidebar";
import SearchBar from "../src/layouts/sidebars/vertical/SearchBar";
import { useEffect, useState } from "react";


const fetcher = (url) => fetch(url).then((res) => res.json());


export default function Home() {
  const { data, error } = useSWR('http://127.0.0.1:5000/getAccapellas', fetcher, {revalidateOnFocus: false});
  const [listings, setListings] = useState(data);
  const [tempListings, setTempListings] = useState(data);
  

  useEffect(() => {
    setListings(data?.listings)
    setTempListings(data?.listings)
  }, [data])
  if(!data){
    return (<div></div>);
  }

  console.log(listings)

  const listingArr = data.listings;
  return (
    <div>
      <div  className="pageWrapper d-md-block d-lg-flex">
      <aside
          className={`sidebarArea shadow bg-white ${
            !open ? "" : "showSidebar"
          }`}
        >
          <SearchBar setData={e => {
            e.preventDefault();
            const name = e.target.name.value;
            const author = e.target.author.value;
            const key = e.target.key.value;
            const bpmLow = e.target.bpmLow.value;
            const bpmHigh = e.target.bpmHigh.value;
            const topicsStr = e.target.topics.value;
            const topicsArr = topicsStr.split(' ');
            const filtered = listings.filter(listing => {
              // console.log(`${listing.aca.accapella.name}  ${topicsArr}`);
              return (name.length === 0 ||  (name.length > 0 && name === listing.aca.accapella.name))
              && (author.length === 0 || (author.length > 0 && author === listing.user_id))
              && (key.length === 0 || (key.length > 0 && key === listing.aca.accapella.key))
              && (bpmLow.length === 0 || (bpmLow.length > 0 && parseInt(bpmLow) < parseInt(listing.aca.accapella.bpm)))
              && (bpmHigh.length === 0 || (bpmHigh.length > 0 && parseInt(bpmHigh) > parseInt(listing.aca.accapella.bpm)))
              && (topicsArr[0].length === 0 || (topicsArr[0].length > 0 && topicsArr.every(topic => listing.aca.accapella.topics.includes(topic))));
            })
            setListings(filtered);
          }}/>
        </aside>
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
            <ProjectTables data={listings}/>
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