import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Button, Modal } from "react-bootstrap";
import "../styles/Orders.css";
import { GoPencil } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { MdDone } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import Cookies from "universal-cookie";
import openSocket from 'socket.io-client'

const cookies = new Cookies();

class Orders extends React.Component {
  state = {
    show: false,
    orders: [],
    ordersInMaking: [],
    username: "",
    mainErr: "",
    orderInMaking: false,
    rander: false,
    modalOrder: null,
    orderTotal: "",
    delayChange: false,
    delayTime: "",
    setDelayTime: ""
  };


  componentDidMount() {
    this.fetchData();
    this.fetchInMakingOrders();
    this.getLatency();
    const socket = openSocket('http://localhost:8000')

    socket.on('orders', data => {
      if (data.action === 'newOrder') {
        this.setState(prevState => {
          const updatedOrders = [...prevState.orders]
          updatedOrders.unshift(data.order)
          return {
            orders: updatedOrders
          }
        })
      }
      if (data.action === 'readyToDeliver') {
        this.setState(prevState => {
          const orders = prevState.ordersInMaking.filter(order => (order._id !== data.order._id))
          return {
            ordersInMaking: orders
          }
        })
      }
      if (data.action === 'inMaking') {
        this.setState(prevState => {
          const updated = prevState.orders.filter(order => (order._id !== data.order._id))
          const updatedInMakingOrders = [...prevState.ordersInMaking]
          updatedInMakingOrders.unshift(data.order)
          return {
            orders: updated,
            ordersInMaking: updatedInMakingOrders
          }
        })
      }
    })
  }

  handleClose = e => {
    this.setState({ show: false });
  };

  handleShow = async (order, orderTotal) => {
    await this.setState({
      show: true,
      modalOrder: order,
      orderTotal
    });
  };

  changeDelay = async (e) => {
    await this.setState({
      delayChange: !this.state.delayChange
    })
  };

  delayUpdate = async (e) => {
    this.setState({
      setDelayTime: e.target.value
    })
  }

  fetchData = async () => {
    const adminToken = cookies.get("adminToken");
    const adminUsername = cookies.get("adminUsername");

    try {
      const api_call = await axios.get(
        "http://localhost:8000/orders/listNotInMakingOrders"
      );
      const orders = api_call.data.orders;
      console.log(adminToken);

      this.setState({
        orders: orders,
        username: adminUsername
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };

  fetchInMakingOrders = async () => {
    try {
      const api_call = await axios.get(
        "http://localhost:8000/orders/listInMakingOrders"
      );
      const ordersInMaking = api_call.data.orders;

      this.setState({
        ordersInMaking: ordersInMaking
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
      console.log(error)
    }
  };

  getLatency = async () => {
    try {
      const api_call = await axios.get(
        "http://localhost:8000/latency/getLatency"
      );
      const delayTime = api_call.data.time;

      this.setState({
        delayTime
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };

  setLatency = async () => {
    const body = {
      "time": this.state.setDelayTime
    }
    try {
      const api_call = await axios.patch(
        "http://localhost:8000/latency/updateLatency", { body }
      );
      const delayTime = api_call.data.time;

      this.setState({
        delayTime
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };

  setInMakingOrder = async (id) => {
    const orderId = id
    try {
      const api_call = await axios.patch(
        `http://localhost:8000/orders/inMaking/${orderId}`
      );
    } catch (error) {
      // if (error.response.status === 500) {
      //   this.setState({
      //     mainErr: "Username është gabim!"
      //   });
      // }
      console.log(error)
    }
  };

  setDoneOrder = async (id) => {
    const orderId = id
    try {
      const api_call = await axios.patch(
        `http://localhost:8000/orders/done/${orderId}`
      );
    } catch (error) {
      // if (error.response.status === 500) {
      //   this.setState({
      //     mainErr: "Username është gabim!"
      //   });
      // }
    }
  };

  render() {
    return (
      <div className="Order_Div">
        <div className="Left_Div">
          <Sidebar class="orders" />
        </div>
        <div className="Right_Div">
          <div className="Header_Div">
            <Header />
          </div>
          <div className="Order_Elements">

            <div className="Delay_Div">
              <div className="Delay_Text">
                <h3>Vonesa:</h3>
              </div>

              <div className={`Delay_Minutes ${!this.state.delayChange ? "" : "hide"}`}>
                <h3>
                  <input
                    type="text"
                    maxlength="3"
                    value={this.state.delayTime}
                    className="Delay_Minutes_Input"
                  />
                  min
                </h3>
              </div>

              <div className={`Delay_Minutes ${!this.state.delayChange ? "hide" : ""}`}>
                <h3>
                  <input
                    type="text"
                    onChange={e => this.delayUpdate()}
                    maxlength="3"
                    className="Delay_Minutes_Input_Change"
                  />
                  min
                </h3>
              </div>

              <div className={`${!this.state.delayChange ? "Delay_Done" : "Delay_Update"}`}>
                {!this.state.delayChange ?
                  <GoPencil className="Pencil_Style" onClick={e => this.changeDelay()} />
                  :
                  <FaCheck className="Check_Style" onClick={e => this.changeDelay()} />
                }
              </div>

            </div>
            <div className="Orders_Table">

              {this.state.orders.map(order => (
                <div className="Single_Order" key={order._id}>
                  <div className="Order_Text" onClick={() => this.handleShow(order, order.orderTotal)}>
                    {order.items.map(item =>
                      <h3>
                        {order.items.length > 1 ?
                          `${item.qty} ${item.name}, ${' '}` :
                          `${item.qty} ${item.name}`
                        }
                      </h3>
                    )}
                  </div>
                  <div>
                    <GoPlus className="Plus_Style" onClick={() => this.setInMakingOrder(order._id)} />
                  </div>
                </div>
              ))}

              {this.state.ordersInMaking.map(orderInMaking => (
                <div className="Single_Order" key={orderInMaking._id}>
                  <div className="Order_Text_Completed" onClick={() => this.handleShow(orderInMaking, orderInMaking.orderTotal)}>
                    {orderInMaking.items.map(item =>
                      <h3>
                        {orderInMaking.items.length > 1 ?
                          `${item.qty} ${item.name}, ${' '}` :
                          `${item.qty} ${item.name}`
                        }
                      </h3>
                    )}
                  </div>
                  <div>
                    <MdDone className="Done_Style" onClick={() => this.setDoneOrder(orderInMaking._id)} />
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header className="Modal_Header" closeButton>
            <Modal.Title>
              <h3>Porosia</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="Modal_Body">
            {this.state.modalOrder !== null ?
              this.state.modalOrder.items.map(item =>
                <tr className="Modal_Body_Row" key={item.productId}>
                  <td><div className="Modal_Body_Product">{`${item.name} $`}</div></td>
                  <td><div className="Modal_Body_Price">{`${item.price} $`}</div></td>
                </tr>
              )
              :
              <tr>Bllaaa</tr>
            }
          </Modal.Body>

          <Modal.Footer className="Modal_Footer">
            <div className="Modal_Body_Product Footer">Totali</div>
            <div className="Modal_Body_Price_Total_Order">{`${this.state.orderTotal} $`}</div>
          </Modal.Footer>

        </Modal>
      </div>
    );
  }
}

export default Orders;

  // const headers = {
  //   token: adminToken
  // };

  // let data = {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
  //   "Access-Control-Allow-Headers":
  //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  // };