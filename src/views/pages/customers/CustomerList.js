import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Card, Table, InputGroup, Form, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import 'intro.js/introjs.css';
import { useSelector } from 'react-redux';
import { ColumnDirective, ColumnsDirective, GridComponent, Page, Sort, Filter, Inject } from '@syncfusion/ej2-react-grids';
import { BsArrowLeft, BsArrowRight, BsPerson, BsCalendar, BsPhone, BsImages, BsGeoAlt, BsHouse, BsGenderAmbiguous, BsEye } from 'react-icons/bs';
import { FaFloppyDisk, FaPencil } from 'react-icons/fa6';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { MdCancel } from 'react-icons/md';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import { BiEdit, BiMessage } from 'react-icons/bi';
import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';
import { GiTrashCan } from 'react-icons/gi';
import SweetAlert from 'react-bootstrap-sweetalert';
import {useHistory} from "react-router-dom";
import { allRoomTypes, editRoomType, newRoomType } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allProfiles } from '../../../services/profileService';
import {getObjectsWithDate} from "../../../assets/functions";

const CustomerList = () => {
  const title = 'Customer List';
  const description = 'Customer List';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [allCustomerProfiles, setAllProfiles] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [services, setServices] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const [images, setImages] = useState(null);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [saveMode, setSaveMode] = useState('save');
  const [prevKey, setPrevKey] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const history = useHistory();

  const [formData, setFormData] = useState({
    facility: '',
    bookedBy: '',
    startDate: '',
    endDate: '',
    guests: '',
    depositAmount: '',
    balanceAmount: '',
    status: '',
    createdAt: '',
  });

  const [tabInView, setTabInView] = useState('all');

  const GenderTemplate = ({ gender }) => {
    return <div className="text-capitalize">{gender}</div>;
  };

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [{ field: 'name', direction: 'Ascending' }] };

  const breadcrumbs = [
    { to: '', text: 'Customer List' },
    { to: 'dashboards', text: 'Customer List' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });
  const ref = useRef();

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = [];

    if (step === 0) {
      const requiredFields = ['status', 'facility', 'bookedBy'];

      // get all the keys of the booking form
      const keys = Object.keys(formData);

      // loop through and get invalid fields
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (formData[key] === '' && requiredFields?.includes(key)) {
          invalidFields.push(key);
          toast.error(`The ${key} field is required.`);
        }
      }

      console.log({ invalidFields });
      setErrorFields((prevState) => Array.from(new Set([...errorFields, ...invalidFields])));
    }

    return invalidFields.length === 0;
  };

  // fetch all room types
  useEffect(() => {
    allProfiles(1, 1000).then((res) => {
      const customers = res?.filter((el) => el?.type === 'customer');
      console.log('Customers: ', { customers });
      if (tabInView === 'all') {
        setProfiles(customers);
        setAllProfiles(customers);
      }
    });
  }, [tabInView]);

  const handleEditIconClicked = (row) => {
    console.log({ row });
    // setFormData(row);
    // setSaveMode('edit');
    // // eslint-disable-next-line no-underscore-dangle
    // setPrevKey(row?._id);
    // setSelectedItem(row);
    history.push('/customers/new-customer',{data: JSON.stringify(row) });
  };

  const handleDeleteIconClicked = (row) => {
    console.log({ row });
    // eslint-disable-next-line no-underscore-dangle
    setPrevKey(row?._id);
    setShowDeleteAlert(true);
  };

  // const deleteItem = (id) => {
  //   editFacilityBookings(id, { isDeleted: true }).then((res) => {
  //     allFacilityBookings(1, 1000).then((response) => {
  //       setProfiles(response);
  //       setShowDeleteAlert(false);
  //     });
  //   });
  // };

  const openItemModal = (row) => {
    setSelectedItem(row);
    setShowItem(true);
  };

  const closeItemModal = () => {
    setShowItem(false);
  };

  const handleMessagingIconClicked = (props) => {
    const{phone, email: cusEmail}=props;
    console.log(history.location);
    history.push('/customers/messaging',{data:phone, emailData:cusEmail });
  }

  const ActionButtons = (props) => {
    return (
      <div className="d-flex">
        <button onClick={() => handleEditIconClicked(props)} type="button" className="btn btn-secondary rounded-2 me-3">
          <FaPencil style={{ width: 15, height: 15 }} />
        </button>
        <button onClick={() => handleMessagingIconClicked(props)} type="button" className="btn btn-primary rounded-2 me-3">
          <BiMessage style={{ width: 15, height: 15 }} />
        </button>
        {/* <button onClick={() => handleDeleteIconClicked(props)} type="button" className="btn btn-danger rounded-2"> */}
        {/*  <GiTrashCan style={{ width: 20, height: 20 }} /> */}
        {/* </button> */}
      </div>
    );
  };

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
      <Row className="mb-4">
        <Col className="d-flex flex-row">
          <h5
            onClick={() => setTabInView('all')}
            className={tabInView === 'all' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
          >
            All
          </h5>
          <h5
            onClick={() => {
              const res2 = getObjectsWithDate(allCustomerProfiles,'dateOfBirth')
              console.log({res2})
              setProfiles(res2)
              setTabInView('birthday-today')
            }}
            className={tabInView === 'birthday-today' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
          >
            Birthday Today
          </h5>
          <h5
            onClick={() => {
              const res2 = getObjectsWithDate(allCustomerProfiles,'marriageAnniversary')
              console.log({res2})
              setProfiles(res2)
              setTabInView('anniversary-today')
            }
            }
            className={tabInView === 'anniversary-today' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
          >
            Anniversary Today
          </h5>
          {/* <h5 */}
          {/*  onClick={() => setTabInView('cancelled')} */}
          {/*  className={tabInView === 'cancelled' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'} */}
          {/* > */}
          {/*  Cancelled */}
          {/* </h5> */}
        </Col>
      </Row>
      <Row>
        <Col>
          <GridComponent dataSource={profiles} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
            <ColumnsDirective>
              <ColumnDirective field="firstName" headerText="First Name" width="80" />
              <ColumnDirective field="lastName" headerText="Last Name" width="80" />
              {/* <ColumnDirective field="otherNames" headerText="Other Names" width="80" /> */}
              <ColumnDirective field="gender" headerText="Gender" template={GenderTemplate} width="50" />
              <ColumnDirective field="phone" headerText="Phone" width="100" />
              <ColumnDirective field="email" headerText="Email" width="100" />
              <ColumnDirective headerText="Actions" template={ActionButtons} width="100" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter]} />
          </GridComponent>
        </Col>
      </Row>
      {showDeleteAlert && (
        <SweetAlert
          title="Delete order"
          info
          showCancel
          confirmBtnBsStyle="warning"
          confirmBtnText="Delete"
          // cancelBtnBsStyle="danger"
          onConfirm={() => {
            // deleteItem(prevKey);
          }}
          onCancel={() => {
            setShowDeleteAlert(false);
          }}
        >
          Are you sure you want to delete this order?
        </SweetAlert>
      )}
    </>
  );
};

export default CustomerList;
