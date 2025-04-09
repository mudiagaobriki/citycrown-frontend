import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Modal, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { ColumnDirective, ColumnsDirective, GridComponent, Page, Sort, Inject } from '@syncfusion/ej2-react-grids';
import { FaPencil, FaFloppyDisk } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import SweetAlert from "react-bootstrap-sweetalert";
import { allKitchenBarOrders, editKitchenBarOrder } from "../../../services/KitchenBarOrderService";

const KitchenBarOrders = () => {
  const title = 'Food and Drink Orders';
  const description = 'Food and Drink Orders';

  const [allOrders, setAllOrders] = useState([]);
  const [tabInView, setTabInView] = useState('all');
  const [selectedItem, setSelectedItem] = useState({});
  const [showItem, setShowItem] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [prevKey, setPrevKey] = useState('');

  const [orderSource, setOrderSource] = useState('all'); // New state for order source

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [{ field: 'items', direction: 'Ascending' }] };

  const breadcrumbs = [
    { to: '', text: 'Kitchen and Bar' },
    { to: 'dashboards', text: 'Food/Drink Orders' },
  ];

  const ItemsTemplate = ({ orderItems }) => {
    const handleItemChange = (index, field, value) => {
      const updatedItems = [...selectedItem.orderItems];

      // If updating quantity or price, ensure price is a number
      if (field === 'quantity') {
        updatedItems[index][field] = parseInt(value, 10) || 0;  // Convert quantity to integer
      } else if (field === 'price') {
        updatedItems[index][field] = parseFloat(value) || 0; // Convert price to number
      } else {
        updatedItems[index][field] = value;
      }

      setSelectedItem({ ...selectedItem, orderItems: updatedItems });

      // Update the total amount after change
      const updatedTotalAmount = updatedItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;  // Convert price to number
        const quantity = parseInt(item.quantity, 10) || 0;  // Convert quantity to integer
        return total + (price * quantity);
      }, 0);

      // Update totalAmount in the order details
      setSelectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        orderDetails: {
          ...prevSelectedItem.orderDetails,
          totalAmount: updatedTotalAmount,
        }
      }));
    };

    return orderItems.map((item, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <Form.Control
              type="text"
              value={item?.Id?.name || ''}
              onChange={(e) => handleItemChange(index, 'Id', { ...item.Id, name: e.target.value })}
              className="me-2"
              placeholder="Item Name"
          />
          <Form.Control
              type="number"
              value={item?.quantity || ''}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
          />
        </div>
    ));
  };

  const fetchOrders = () => {
    allKitchenBarOrders(1, 1000).then((res) => {
      if (tabInView === 'all') {
        if (orderSource === 'all'){
          setAllOrders(res);
        }
        else{
          setAllOrders(res.filter(el => el?.orderDetails?.orderSource === orderSource));
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (orderSource === 'all'){
          setAllOrders(res.filter((el) => el?.orderDetails?.status === tabInView));
        }
        else{
          setAllOrders(res.filter((el) => (el?.orderDetails?.status === tabInView) && (el?.orderDetails?.orderSource === orderSource)));
        }
        // setAllOrders(res.filter((el) => (el?.orderDetails?.status === tabInView) && (el?.orderDetails?.orderSource === orderSource)));
      }
    });
  };

  useEffect(() => {
    fetchOrders();
    console.log({allOrders});
  }, [tabInView, orderSource]);

  // useEffect(() => {
  //   console.log({allOrders, orderSource});
  //   if (orderSource !== 'all') {
  //     setAllOrders(prevState => prevState.filter(el => el?.orderDetails?.orderSource === orderSource));
  //   }
  // }, [orderSource]);

  const openItemModal = (row) => {
    setSelectedItem(row);
    setShowItem(true);
  };

  const closeItemModal = () => {
    setShowItem(false);
  };

  const deleteItem = (id) => {
    editKitchenBarOrder(id, { isDeleted: true }).then(() => {
      fetchOrders();
      setShowDeleteAlert(false);
    });
  };

  const handleSaveChanges = () => {
    // eslint-disable-next-line no-underscore-dangle
    editKitchenBarOrder(selectedItem._id, selectedItem).then(() => {
      fetchOrders();
      closeItemModal();
    });
  };

  return (
      <>
        <HtmlHead title={title} description={description} />
        <div className="page-title-container mb-7">
          <Row>
            <Col md="7">
              <h1 className="mb-0 pb-0 display-4">{title}</h1>
              <BreadcrumbList items={breadcrumbs} />
            </Col>
          </Row>
        </div>

        {/* Dropdown for selecting order source */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="orderSource">
              <Form.Label>Select Order Source</Form.Label>
              <Form.Control
                  as="select"
                  value={orderSource}
                  onChange={(e) => setOrderSource(e.target.value)}
              >
                <option value="all">All</option>
                <option value="kitchen">Kitchen</option>
                <option value="bar">Bar</option>
                <option value="pool">Pool</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="d-flex">
            {['all', 'delivered', 'in progress', 'pending', 'cancelled'].map((status) => (
                <h5
                    key={status}
                    onClick={() => setTabInView(status)}
                    className={`me-4 cursor-pointer ${tabInView === status ? 'text-decoration-underline font-weight-bold text-primary' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </h5>
            ))}
          </Col>
        </Row>

        <Row>
          <Col>
            <GridComponent
                dataSource={allOrders}
                allowPaging
                pageSettings={pageSettings}
                allowSorting
                sortSettings={sortSettings}
            >
              <ColumnsDirective>
                <ColumnDirective field="items" headerText="Items" width="200" template={ItemsTemplate} />
                <ColumnDirective field="orderDetails.totalAmount" headerText="Total" width="100" />
                <ColumnDirective field="orderDetails.status" headerText="Status" width="100" />
                <ColumnDirective
                    headerText="Actions"
                    width="100"
                    template={(rowData) => (
                        <div>
                          <Button className="me-2" variant="primary" onClick={() => openItemModal(rowData)}>
                            <FaPencil />
                          </Button>
                          <Button variant="danger" onClick={() => setShowDeleteAlert(true)}>
                            Delete
                          </Button>
                        </div>
                    )}
                />
              </ColumnsDirective>
              <Inject services={[Page, Sort]} />
            </GridComponent>
          </Col>
        </Row>

        <Modal show={showItem} onHide={closeItemModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
                as="select"
                value={selectedItem?.orderDetails?.status || ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, orderDetails: { ...selectedItem.orderDetails, status: e.target.value } })}
            >
              {['pending', 'in progress', 'delivered', 'cancelled'].map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
              ))}
            </Form.Control>
            <ItemsTemplate orderItems={selectedItem?.orderItems || []} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeItemModal}>
              Cancel <MdCancel />
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes <FaFloppyDisk />
            </Button>
          </Modal.Footer>
        </Modal>

        {showDeleteAlert && (
            <SweetAlert
                title="Delete Order"
                info
                showCancel
                confirmBtnBsStyle="warning"
                confirmBtnText="Delete"
                onConfirm={() => deleteItem(prevKey)}
                onCancel={() => setShowDeleteAlert(false)}
            >
              Are you sure you want to delete this order?
            </SweetAlert>
        )}
      </>
  );
};

export default KitchenBarOrders;
