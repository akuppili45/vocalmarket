import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardGroup,
    Button,
    Row,
    Col,
  } from "reactstrap";
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json());

  
const Cards = () => {
    const apiUrl = `https://cat-fact.herokuapp.com/facts/`
    const { data: itemsData, error } = useSWR(apiUrl, fetcher);
    console.log(itemsData)
    return (
      <div>
       cats
      </div>
    );
  };
  
  export default Cards;
  