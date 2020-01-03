import React from "react";
import { Table } from "reactstrap";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Archive.css";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Archive extends React.Component {
  state = {
    class: "",
    activeClass: "day",
    archivedByPrefix: [],
    modal: false,
    userOrder: [],
    orderTotal: ""
    // archiveShowFromHap: false
  };

  componentDidMount() {
    this.archivedOrders();
  }

  activeButton = async e => {
    await this.setState({ class: e.target.id });

    // Kom me bo Modalin te Archive

    if (this.state.class === "all") {
      await this.setState({ activeClass: this.state.class });
    } else if (this.state.class === "day") {
      await this.setState({ activeClass: this.state.class });
    } else if (this.state.class === "week") {
      await this.setState({ activeClass: this.state.class });
    } else if (this.state.class === "month") {
      await this.setState({ activeClass: this.state.class });
    }
    this.archivedOrders();
  };

  //Modal Handle from "Hap" in Driver Orders Modal
  handleCloseHap = e => {
    this.setState({ modal: false });
  };

  handleShowHap = async (order, orderTotalPrice) => {
    const userOrder = order;
    const orderTotal = orderTotalPrice;
    this.setState({
      modal: true,
      userOrder,
      orderTotal
    });
  };

  archivedOrders = async () => {
    try {
      const activeClass = this.state.activeClass
      console.log(activeClass)
      const api_call = await axios.get(
        `http://localhost:8000/orders/filter/${activeClass}`
      );
      const ordersByPrefix = api_call.data.orders;
      console.log(ordersByPrefix);

      await this.setState({
        archivedByPrefix: ordersByPrefix,
      });
      console.log(this.state.ordersByPrefix);
    } catch (error) {
      if (error.response.status === 500) {
        this.setState({
          mainErr: "Username është gabim!",
        });
      }
    }
  }

  render() {
    const activee = this.state.activeClass;

    return (
      <div className="Archive_Div">
        <div className="Left_Div">
          <Sidebar class="archive" />
        </div>
        <div className="Right_Div">
          <div className="Header_Div">
            <Header />
          </div>
          <div className="Archive_Elements">
            <div className="Search_Div">
              <div className="Search_Bar">
                <div className="Search_Bar_Button">
                  <button
                    className={`All ${activee === "all" ? "activee" : ""}`}
                    id="all"
                    onClick={e => this.activeButton(e)}
                  >
                    All
                  </button>
                </div>
                <div className="Search_Bar_Button">
                  <button
                    className={`Daily ${activee === "day" ? "activee" : ""}`}
                    onClick={e => this.activeButton(e)}
                    id="day"
                  >
                    Daily
                  </button>
                </div>
                <div className="Search_Bar_Button">
                  <button
                    className={`Weekly ${
                      activee === "week" ? "activee" : ""
                      }`}
                    onClick={e => this.activeButton(e)}
                    id="week"
                  >
                    Weekly
                  </button>
                </div>
                <div className="Search_Bar_Button">
                  <button
                    className={`Monthly ${
                      activee === "month" ? "activee" : ""
                      }`}
                    onClick={e => this.activeButton(e)}
                    id="month"
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>
            <div className="Archive_Table">
              <Table>
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

                  {this.state.archivedByPrefix ?
                    this.state.archivedByPrefix.map(order =>
                      < tr key={order._id}>
                        <td>{order.user.name}</td>
                        <td>{order.user.lastname}</td>
                        <td>{order.user.phone}</td>
                        <td>{order.createdAt}</td>
                        <td><button className="Hap_Button" onClick={() => this.handleShowHap(order.items, order.orderTotal)}>Hap</button></td>
                        {/* onClick={() => this.handleShowHap(order.items, order.orderTotal)} */}
                      </tr>
                    )
                    :
                    <tr>Hajdari</tr>
                  }

                </tbody>
              </Table>
            </div>
          </div>
        </div>

        <Modal isOpen={this.state.modal} toggle={this.handleCloseHap} className={this.props.className}>
          <ModalHeader toggle={this.handleCloseHap}><h4>User Order</h4></ModalHeader>
          <ModalBody>
            {this.state.userOrder.map(order =>
              <tr className="Modal_Body_Row">
                <td><div className="Modal_Body_Product">{order.name}</div></td>
                <td><div className="Modal_Body_Price">{`${order.price} $`}</div></td>
              </tr>
            )}
          </ModalBody>
          <ModalFooter className="Modal_Body">
            <div className="Modal_Body_Product Footer">Totali</div>
            <div className="Modal_Body_Price_Total">{`${this.state.orderTotal} $`}</div>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default Archive;