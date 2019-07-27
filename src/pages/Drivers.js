import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Table, Modal } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import "../styles/Drivers.css";
import { GiSteeringWheel } from "react-icons/gi";

const cookies = new Cookies();

class Drivers extends React.Component {
  state = {
    show: false,
    showFromHap: false,
    setShow: false,
    drivers: [],
    driverOrders: [],
    driverSingleOrder: [],
    orderTotal: ""
  };

  //Driver Orders Modal Handle
  handleClose = e => {
    this.setState({ show: false });
  };
  handleShow = async (id) => {
    this.setState({ show: true });

    const driverId = id
    this.getDriverOrders(driverId);
  };

  //Modal Handle from "Hap" in Driver Orders Modal
  handleCloseHap = e => {
    this.setState({ showFromHap: false });
  };
  handleShowHap = async (order, orderTotalPrice) => {
    const driverOrder = order;
    const orderTotal = orderTotalPrice;
    this.setState({
      showFromHap: true,
      driverSingleOrder: driverOrder,
      orderTotal
    });
  };

  //Call API Route first
  componentDidMount() {
    this.getDrivers();
  }

  getDrivers = async () => {
    try {
      const api_call = await axios.get(
        "http://localhost:8000/drivers/getDrivers"
      );
      const drivers = api_call.data;

      this.setState({
        drivers: drivers
      });
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };

  getDriverOrders = async (id) => {
    const driverId = id;
    try {
      const api_call = await axios.get(
        `http://localhost:8000/orders/getOrdersByDriverID/${driverId}`
      );
      const driverOrders = api_call.data.myOrders;
      console.log(driverOrders);

      this.setState({
        driverOrders: driverOrders
      });

    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!"
        });
      }
    }
  };

  render() {
    return (
      <div className="Drivers_Div">
        <div className="Left_Div">
          <Sidebar class="drivers" />
        </div>
        <div className="Right_Div">
          <div className="Header_Div">
            <Header />
          </div>
          <div className="Driver_Elements">
            <div className="Drivers_List">
              {this.state.drivers.map(driver => (
                <div className="Single_Driver" key={driver._id}>
                  <div className="Driver_Info">
                    <div className="Driver_Info_Left">
                      <GiSteeringWheel className="Driver_Icon" />
                    </div>
                    <div className="Driver_Info_Right">
                      <h3>
                        {driver.username}
                      </h3>
                    </div>
                  </div>
                  <div className="Driver_Orders">
                    <button
                      className="Driver_Orders_Button"
                      onClick={() => this.handleShow(driver._id)}
                    >
                      <h3>Orders</h3>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Driver Orders
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table className="Modal_Table">
              <thead>
                <tr>
                  <th>Emri</th>
                  <th>Mbiemri</th>
                  <th>Telefoni</th>
                  <th>Data</th>
                  <th>Porosia</th>
                </tr>
              </thead>

              <tbody>

                {this.state.driverOrders.map(driverOrder => (
                  <tr key={driverOrder._id}>
                    <td>Filon</td>
                    <td>Fisteki</td>
                    <td>+38349420629</td>
                    <td>{driverOrder.createdAt}</td>
                    <td><button className="Hap_Button" onClick={() => this.handleShowHap(driverOrder.items, driverOrder.orderTotal)}>Hap</button></td>
                  </tr>
                ))}

              </tbody>
            </Table>
          </Modal.Body>
        </Modal>


        <Modal
          show={this.state.showFromHap}
          onHide={this.handleCloseHap}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Driver Orders
            </Modal.Title>
          </Modal.Header>

          <Modal.Body >
            {this.state.driverSingleOrder.map(singleOrder =>
              <tr className="Modal_Body_Row">
                <td><div className="Modal_Body_Product">{singleOrder.name}</div></td>
                <td><div className="Modal_Body_Price">{`${singleOrder.price} $`}</div></td>
              </tr>
            )}
          </Modal.Body>


          <br />
          <Modal.Footer className="Modal_Body">
            <div className="Modal_Body_Product Footer">Totali</div>
            <div className="Modal_Body_Price_Total">{`${this.state.orderTotal} $`}</div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Drivers;
