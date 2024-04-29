import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Card, Table, InputGroup, Form, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import 'intro.js/introjs.css';
import { useSelector } from 'react-redux';
import { ColumnDirective, ColumnsDirective, GridComponent, Page, Sort, Filter, Inject } from '@syncfusion/ej2-react-grids';
import { BsArrowLeft, BsArrowRight, BsPerson, BsCalendar, BsPhone, BsImages, BsGeoAlt, BsHouse, BsGenderAmbiguous, BsEye } from 'react-icons/bs';
import { FaFloppyDisk, FaPencil } from 'react-icons/fa6';
import { FaCubes, FaBan, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
// import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
// import { MdCancel } from 'react-icons/md';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
// import { BiEdit } from 'react-icons/bi';
// import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';
// import { FiDelete } from 'react-icons/fi';
import { GiTrashCan } from 'react-icons/gi';
import SweetAlert from 'react-bootstrap-sweetalert';
// import { allRoomTypes } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allStores, newStore, editStore } from '../../../services/storeService';
import { allStoreCategories } from '../../../services/storeCategoryService';
import BarChartOne from './BarChartOne';

const InventoryReports = () => {
  const title = 'Inventory Reports';
  const description = 'Inventory Reports';

  const ref = useRef();

  const [storeItems, setStoreItems] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [totalActiveItems, setTotalActiveItems] = useState(0);
  const [totalInActiveItems, setTotalInActiveItems] = useState(0);
  const [totOutOfStock, setTotalOutOfStock] = useState(0);
  const [totalStoreItems, setTotalStoreItems] = useState(0);

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/reports/inventory-reports', text: 'Inventory Reports' },
  ];

  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    allStores(1, 1000).then((response) => {
      console.log({ resCat: response });
      setStoreItems(response);

      const totActive = response.filter((itm) => itm?.status?.toLowerCase() === 'active');
      const totInActive = response.filter((itm) => itm?.status?.toLowerCase() !== 'active');
      const totOutOfStockItm = response.filter((itm) => itm.quantity === 0);

      setTotalActiveItems(totActive?.length);
      setTotalInActiveItems(totInActive?.length);
      setTotalOutOfStock(totOutOfStockItm?.length);
      setTotalStoreItems(response?.length);
    });
  }, []);

  return (
    <>
      <HtmlHead title={title} description={description} />

      {/* Title and Top Buttons Start */}
      <div className="page-title-container mb-7">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">{title}</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          {/* Top Buttons End */}
        </Row>
      </div>
      {/* Title and Top Buttons End */}

      <Row className="mb-2">
        <Col md={3} className="mb-4 mb-md-2">
          <Card>
            <Card.Body>
              <div className="card-content">
                <FaCubes size={35} />
                <div className="mt-2">
                  <Card.Title>Total Store Items</Card.Title>
                  <Card.Text>{totalStoreItems}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4 mb-md-2">
          <Card>
            <Card.Body>
              <div className="card-content">
                <FaExclamationTriangle size={38} />
                <div className="mt-2">
                  <Card.Title>Total Out of Stock Items</Card.Title>
                  <Card.Text>{totOutOfStock}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4 mb-md-2">
          <Card>
            <Card.Body>
              <div className="card-content">
                <FaCheckCircle size={38} />
                <div className="mt-2">
                  <Card.Title>Total Active Items</Card.Title>
                  <Card.Text>{totalActiveItems}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4 mb-md-2">
          <Card>
            <Card.Body>
              <div className="card-content">
                <FaBan size={38} />
                <div className="mt-2">
                  <Card.Title>Total Inactive Items</Card.Title>
                  <Card.Text>{totalInActiveItems}</Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="mb-4 mb-md-2">
          {storeItems && <BarChartOne data={storeItems} />}
        </Col>
      </Row>
    </>
  );
};

export default InventoryReports;
