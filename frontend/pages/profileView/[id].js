import Head from "next/head";
import { Col, Row } from "reactstrap";
import useSWR from 'swr';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "../../lib/useUser";
import ProfileTable from "../../src/components/dashboard/ProfileTable";


const fetcher = (url) => fetch(url).then((res) => res.json());



export default function ProfileView() {
  const {user} = useUser();
  const router = useRouter();
  const profileUserID = router.query.id;
  const currUserId = user?.userData?.id;
  const apiUrl = `http://127.0.0.1:5000//getProfile/${currUserId}/${profileUserID}`;
  console.log(apiUrl)
  const { data: fetcherData } = useSWR(profileUserID && currUserId ? apiUrl : null, fetcher);
  console.log(user);
  console.log(fetcherData);
  if (!user || !fetcherData) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <div  className="pageWrapper d-md-block d-lg-flex">
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
                {router.query.id && user ? (
                  <div>
                    <ProfileTable data={fetcherData[1]} isOwnProfile={user && router.query.id === currUserId} currentUser={currUserId} title="Listings"/>
                    <ProfileTable data={fetcherData[0]} isOwnProfile={true} currentUser={currUserId} title="Bought Listings"/>
                  </div>
                  

                ) : (
                  <div></div>
                )}
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