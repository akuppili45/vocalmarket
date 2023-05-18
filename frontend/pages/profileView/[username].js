import Head from "next/head";
import { Col, Row } from "reactstrap";
import useSWR from 'swr';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "../../lib/useUser";


const fetcher = (url) => fetch(url).then((res) => res.json());



export default function ProfileView() {
  const { user } = useUser();
  const router = useRouter();
  console.log(user);
  // const { data, error } = useSWR(`http://127.0.0.1:5000/getPostedAccapellasByUsername/${router.query.username}`, fetcher, {revalidateOnFocus: false});
  // const [tempListings, setTempListings] = useState(data);
  // useEffect(() => {
  //   setTempListings(data?.listings)
  // }, [data])
  console.log(router.query.username);
  // if(!data){
  //   return (<div></div>);
  // }
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
        <h1>ssss</h1>
        <Row>
          <Col lg="12" sm="12">
            {/* <BoughtTable data={data.bought}/> */}
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