import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "../../assets/images/logos/monsterlogowhite.svg";
import user1 from "../../assets/images/users/user1.jpg";
import { useRouter } from 'next/navigation';
import useUser from "../../../lib/useUser";
import fetchJson from "../../../lib/fetchJson";


const Header = ({ showMobmenu }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const { user, mutateUser } = useUser();
  const router = useRouter();
  if(!user){
    return <div>Loading...</div>
  }
  const handleLogout = async event => {
    event.preventDefault();
    console.log("logout");
    // debugger;
    mutateUser(
      await fetchJson("/api/logout", { method: "GET" }),
      false,
    );
    console.log(user);
    router.push("/login")
    
  }
  return (
    <Navbar color="primary" dark expand="md">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          <Image src={LogoWhite} alt="logo" />
        </NavbarBrand>
        <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link href="/" className="nav-link">
              Dashboard
            </Link>
          </NavItem>
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="primary">
            <div style={{ lineHeight: "0px" }}>
              <Image
                src={user1}
                alt="profile"
                className="rounded-circle"
                width="30"
                height="30"
              />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem onClick={() => {
              const id = user?.userData?.id;
              router.push(`/profileView/${id}`)
            }}>My Listings</DropdownItem>
            <DropdownItem onClick={() => router.push('/addListing')}>Add Listing</DropdownItem>
            <DropdownItem onClick={() => router.push('/boughtListings')}>My Purchases</DropdownItem>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
    </Navbar>
  );
};

export default Header;
