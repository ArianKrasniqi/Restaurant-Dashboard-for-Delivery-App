import React from "react";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import "../styles/Header.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { MdAccountCircle } from "react-icons/md";

const cookies = new Cookies();

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      logout: false
    };
  }

  logOut = async () => {
    await cookies.remove("adminToken")
    await cookies.remove("adminUsername")
    await cookies.remove("adminId")

    this.setState({
      logout: true
    })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    if (this.state.logout === true) {
      return <Redirect to="/" />;
    }

    return (
      <div className="Header">
        <Navbar expand="md">
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <MdAccountCircle className="iconStyle" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={this.logOut}>Log Out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
