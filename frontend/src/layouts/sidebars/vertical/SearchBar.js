import { Button, Form, FormGroup, Input, Label, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  {
    title: "Search",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Alert",
    href: "/ui/alerts",
    icon: "bi bi-bell",
  },
  {
    title: "Bar",
    href: "/ui/badges",
    icon: "bi bi-patch-check",
  },
  {
    title: "Stable",
    href: "/ui/buttons",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Job",
    href: "/ui/cards",
    icon: "bi bi-card-text",
  },
  {
    title: "Married",
    href: "/ui/grid",
    icon: "bi bi-columns",
  },
  {
    title: "Eastern",
    href: "/ui/tables",
    icon: "bi bi-layout-split",
  }
];

const SearchBar = ({ showMobilemenu, setData }) => {
  let curl = useRouter();
  const location = curl.pathname;


  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          <Form onSubmit={setData}>
            <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="name"
                  type="name"
                />
                <Label for="name">Author</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="author"
                  type="author"
                />
                <Label for="name">Key</Label>
                <Input
                  id="key"
                  name="key"
                  placeholder="key"
                  type="name"
                />
                <Label for="name">BPM Low</Label>
                <Input
                  id="bpmLow"
                  name="bpmLow"
                  placeholder="BPM Low"
                  type="name"
                />
                <Label for="name">BPM High</Label>
                <Input
                  id="bpmHigh"
                  name="bpmHigh"
                  placeholder="BPM High"
                  type="name"
                />
                <Label for="name">Topics</Label>
                <Input
                  id="topics"
                  name="topics"
                  placeholder="topics"
                  type="name"
                />
            </FormGroup>
            <Button>Search</Button>
          </Form>
        </Nav>
      </div>
    </div>
  );
};

export default SearchBar;
