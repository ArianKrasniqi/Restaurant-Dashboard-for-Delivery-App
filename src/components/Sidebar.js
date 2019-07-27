import React from "react";
import { Nav, Button, Label } from "reactstrap";
import { Redirect } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import "../styles/Sidebar.css";
import { GiSteeringWheel } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { GoFileDirectory } from "react-icons/go";

export default class Sidebar extends React.Component {
  state = {
    id: "",
    toPage: "",
    active: "",
    activePage: ""
  };

  linkToPage = async e => {
    // if (this.state.toPage !== e.target.id)
    await this.setState({ id: e.target.id });

    if (this.state.id === "orders") {
      this.setState({ toPage: this.state.id });
      if (this.state.id !== this.state.activePage) {
        this.setState({ activePage: this.state.id });
      }
    } else if (this.state.id === "drivers") {
      this.setState({ toPage: this.state.id });
      if (this.state.id !== this.state.activePage) {
        this.setState({ activePage: this.state.id });
      }
    } else if (this.state.id === "users") {
      this.setState({ toPage: this.state.id });
      if (this.state.id !== this.state.activePage) {
        this.setState({ activePage: this.state.id });
      }
    } else if (this.state.id === "archive") {
      this.setState({ toPage: this.state.id });
      if (this.state.id !== this.state.activePage) {
        this.setState({ activePage: this.state.id });
      }
    }

    const active = this.state.toPage === "orders" ? " active" : "";
    await this.setState({
      active: active
    });
  };

  render() {
    if (this.state.toPage !== "" && this.state.activePage !== this.state.toPage) {
      return <Redirect to={`/${this.state.toPage}`} />;
    }

    return (
      <div className="Sidebar">
        <Label className="Sidebar_Title">Pasta Fresca</Label>
        <Nav vertical className="Nav_Vertical">
          <Button
            className={`Nav_Button ${
              this.props.class === "orders" ? " active" : ""
              }`}
            id="orders"
            onClick={e => this.linkToPage(e)}
          >
            <FaFileAlt className="Sidebar_Icons" /> Orders
          </Button>
          <Button
            className={`Nav_Button ${
              this.props.class === "drivers" ? " active" : ""
              }`}
            id="drivers"
            onClick={e => this.linkToPage(e)}
          >
            <GiSteeringWheel className="Sidebar_Icons" /> Drivers
          </Button>
          <Button
            className={`Nav_Button ${
              this.props.class === "users" ? " active" : ""
              }`}
            id="users"
            onClick={e => this.linkToPage(e)}
          >
            <FaUsers className="Sidebar_Icons" /> Users
          </Button>
          <Button
            className={`Nav_Button ${
              this.props.class === "archive" ? " active" : ""
              }`}
            id="archive"
            onClick={e => this.linkToPage(e)}
          >
            <GoFileDirectory className="Sidebar_Icons" /> Archive
          </Button>
        </Nav>
      </div>
    );
  }
}
