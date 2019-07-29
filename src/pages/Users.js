import React from "react";
import { Table } from "reactstrap";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Users.css";
import { MdDone } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Users extends React.Component {
  state = {
    users: [],
    banned_users: [],
    phoneNum: "",
    userBannStatus: "",
    searchByPhone: "",
    phoneSearchValue: "",
    usersByPhone: null,
    searchMode: false
  }

  componentDidMount() {
    this.getUsers();
  }

  bannOrUnbannUser = async (phone, bannStatus) => {
    const phoneNum = phone;
    const userBannStatus = bannStatus;
    this.setState({
      phoneNum: phone,
      userBannStatus: bannStatus
    })
    this.bannOrUnbannUser(this.state.phoneNum, this.state.userBannStatus);
  }

  savePhoneInput = async (e) => {
    await this.setState({
      phoneSearchValue: e.target.value
    })
  }

  backFilterByPhone = async () => {
    this.setState({
      phoneSearchValue: "",
      usersByPhone: null,
      searchMode: false
    });
  }

  filterByPhone = async () => {

    this.setState({
      searchMode: true
    })

    try {
      const phone = this.state.phoneSearchValue;
      const api_call = await axios.get(
        `http://localhost:8000/users/getUserByPhone/${phone}`
      );
      const userByPhone = api_call.data.user;

      await this.setState({
        usersByPhone: userByPhone
      });
      console.log(this.state.usersByPhone);
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  }

  getUsers = async () => {
    const adminToken = cookies.get("adminToken");
    const adminUsername = cookies.get("adminUsername");

    try {
      const api_call = await axios.get(
        "http://localhost:8000/users/getUsers"
      );
      const users = api_call.data;

      const api_call_second = await axios.get(
        "http://localhost:8000/users/getBannedUsers"
      );
      const banned_users = api_call_second.data;

      this.setState({
        users: users,
        banned_users: banned_users
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };

  bannOrUnbannUser = async (phoneNum, bannStatus) => {
    const bann = bannStatus;
    try {
      if (bann == false) {
        console.log("ban" + phoneNum + bannStatus);
        const api_call = await axios.patch(
          `http://localhost:8000/users/banUser/${phoneNum}`
        );
        window.location.reload();
      }
      if (bann == true) {
        console.log("unban" + phoneNum + bannStatus);
        const api_call_unban = await axios.patch(
          `http://localhost:8000/users/unbanUser/${phoneNum}`
        );
        window.location.reload();
      }

    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };


  render() {
    console.log(this.state.phoneSearchValue)
    return (
      <div className="Users_Div">

        <div className="Left_Div">
          <Sidebar class="users" />
        </div>

        <div className="Right_Div">

          <div className="Header_Div">
            <Header />
          </div>

          <div className="Users_Elements">

            <div className="Search_Div">

              <div className={`User_NotFound ${this.state.usersByPhone !== undefined ? "Hide" : ""}`} >User not found!</div>

              <div className="Search_Number">
                <input
                  className="Search_Number_Input"
                  placeholder="Kërko Nr. tel"
                  onChange={e => this.savePhoneInput(e)}
                  value={this.state.phoneSearchValue}
                />
              </div>

              <div className={`Search_Button ${this.state.searchMode ? "Hide" : ""}`} onClick={() => this.filterByPhone()}>
                <FaSearch className="Search_Icon" />
              </div>

              <div className={`Search_Button ${this.state.searchMode ? "" : "Hide"}`} onClick={() => this.backFilterByPhone()}>
                <MdClose className="Search_Icon" />
              </div>

            </div>

            <div className="Users_Table">
              <Table>
                <thead>
                  <tr>
                    <th>Emri</th>
                    <th>Mbiemri</th>
                    <th>Telefoni</th>
                    <th>Telefoni</th>
                    <th>Statusi</th>
                  </tr>
                </thead>

                <tbody >

                  {this.state.usersByPhone == null ?
                    this.state.users.map(user =>
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.lastname}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>
                          <div className="Confirm_Button">
                            <MdDone className="Confirm_Button_Line" onClick={() => this.bannOrUnbannUser(user.phone, user.banned)} />
                          </div>
                        </td>
                      </tr>
                    )
                    :
                    this.state.usersByPhone.banned == false ?
                      <tr key={this.state.usersByPhone._id}>
                        <td>{this.state.usersByPhone.name}</td>
                        <td>{this.state.usersByPhone.lastname}</td>
                        <td>{this.state.usersByPhone.phone}</td>
                        <td>{this.state.usersByPhone.email}</td>
                        <td>
                          <div className="Confirm_Button" >
                            <MdDone className="Confirm_Button_Line" onClick={() => this.bannOrUnbannUser(this.state.usersByPhone.phone, this.state.usersByPhone.banned)} />
                          </div>
                        </td>
                      </tr>
                      :
                      <tr></tr>
                  }

                  {this.state.usersByPhone == null ?
                    this.state.banned_users.map(banned_user =>
                      <tr key={banned_user._id}>
                        <td>{banned_user.name}</td>
                        <td>{banned_user.lastname}</td>
                        <td>{banned_user.phone}</td>
                        <td>{banned_user.email}</td>
                        <td>
                          <div className="Deny_Button" onClick={() => this.bannOrUnbannUser(banned_user.phone, banned_user.banned)}>
                            <div className="Deny_Button_Line" />
                          </div>
                        </td>
                      </tr>
                    )
                    :
                    this.state.usersByPhone.banned == true ?
                      <tr key={this.state.usersByPhone._id}>
                        <td>{this.state.usersByPhone.name}</td>
                        <td>{this.state.usersByPhone.lastname}</td>
                        <td>{this.state.usersByPhone.phone}</td>
                        <td>{this.state.usersByPhone.email}</td>
                        <td>
                          <div className="Deny_Button" onClick={() => this.bannOrUnbannUser(this.state.usersByPhone.phone, this.state.usersByPhone.banned)}>
                            <div className="Deny_Button_Line" />
                          </div>
                        </td>
                      </tr>
                      :
                      <tr></tr>
                  }

                </tbody>
              </Table>
            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default Users;
