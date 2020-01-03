import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Label } from "reactstrap";
import "../styles/Login.css";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
      mainErr: "",
      toOrders: false
    };
  }

  handleUsername = (username, type) => {
    this.setState({
      username: username.target.value,
      mainErr: ""
    });
  };

  handlePassword = password => {
    this.setState({
      password: password.target.value,
      mainErr: ""
    });
  };

  login = async () => {
    if (this.state.username === "") {
      this.setState({ usernameError: "Shkruani Username-in" });
      return;
    }
    if (this.state.password === "") {
      this.setState({ passwordError: "Shkruani Password-in" });
      return;
    }

    const user = this.state.username;
    const pass = this.state.password;

    try {
      const api_call = await axios.post(
        "http://localhost:8000/admins/adminLogin",
        {
          username: user,
          password: pass
        }
      );
      const token = api_call.data.token;
      const username = api_call.data.admin.username;
      const id = api_call.data.admin._id;

      await cookies.set("adminToken", token);
      await cookies.set("adminUsername", username);
      await cookies.set("adminId", id);

      this.setState({
        toOrders: true
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      } else if (error.response.status === 401) {
        this.setState({
          mainErr: "Fjalëkalimi është gabim!"
        });
      }
    }
  };

  render() {
    if (this.state.toOrders === true) {
      return <Redirect to="/orders" />;
    }

    return (
      <div className="Main_Div">
        <div className="Login_Div">
          <div className="Login_Elements">
            <h1 className="Login_Text">Log In</h1>
            <br />
            <input
              className="User_Input"
              type="text"
              placeholder="Username"
              onChange={(username, type) => this.handleUsername(username, type)}
            />
            <Label>{this.state.username === "" ? this.state.usernameError : ""}</Label>
            <br />
            <input
              className="User_Input"
              type="password"
              placeholder="Password"
              onChange={password => this.handlePassword(password)}
            />
            <Label>{this.state.password === "" ? this.state.passwordError : ""}</Label>
            <br />
            <div className="Button_MainErr">
              <Label className="Main_Err">{this.state.mainErr}</Label>
              <Button className="Button" onClick={this.login}>
                Log In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
