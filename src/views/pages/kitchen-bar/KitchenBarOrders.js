import React, {useEffect, useRef, useState} from 'react';
import {Button, Row, Col, Card, Table, InputGroup, Form, Modal,} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import 'intro.js/introjs.css';
import { useSelector } from 'react-redux';
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Page,
  Sort,
  Filter,
  Inject
} from '@syncfusion/ej2-react-grids';
import {
  BsArrowLeft,
  BsArrowRight,
  BsPerson,
  BsCalendar,
  BsPhone,
  BsImages,
  BsGeoAlt,
  BsHouse,
  BsGenderAmbiguous,
  BsEye
} from 'react-icons/bs';
import {FaFloppyDisk, FaPencil} from "react-icons/fa6";
import { MultiSelectComponent  } from '@syncfusion/ej2-react-dropdowns';
import {MdCancel} from "react-icons/md";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {toast} from "react-toastify";
import {BiEdit} from "react-icons/bi";
import {AiFillDelete, AiOutlineDelete} from "react-icons/ai";
import {FiDelete} from "react-icons/fi";
import {GiTrashCan} from "react-icons/gi";
import SweetAlert from "react-bootstrap-sweetalert";
import {allRoomTypes, editRoomType, newRoomType} from "../../../services/roomTypeService";
import {storage} from '../../../hooks/useFirebase'
import {allAmenities, editAmenity, newAmenity} from "../../../services/amenityService";
import {allServices} from "../../../services/servicesService";
import {
  allKitchenBarCategories,
  editKitchenBarCategories,
  newKitchenBarCategories
} from "../../../services/KitchenBarCategoryService";
import {
  allKitchenBarOrders,
  editKitchenBarOrder,
  newKitchenBarOrder
} from "../../../services/KitchenBarOrderService";

const KitchenBarOrders = () => {
  const title = 'Kitchen and Bar Orders';
  const description = 'Kitchen and Bar Orders';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [allOrders, setAllOrders] = useState([]);
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

  const [formData, setFormData] = useState({
    roomNumber: '',
    status: '',
    comments: '',
    customerName: '',
  });

  const [tabInView, setTabInView] = useState('all')

  const TypeTemplate = ({type}) => <div className="text-capitalize">{type}</div>

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [
      { field: 'name', direction: 'Ascending' }
    ] };


  const breadcrumbs = [
    { to: '', text: 'Kitchen and Bar' },
    { to: 'dashboards', text: 'Food/Drink Orders' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });
  const ref = useRef()

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = []

    if (step === 0){
      const requiredFields = ['status']

      // get all the keys of the booking form
      const keys = Object.keys(formData)

      // loop through and get invalid fields
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < keys.length; i++){
        const key = keys[i];
        if (formData[key] === "" && requiredFields?.includes(key)){
          invalidFields.push(key)
          toast.error(`The ${key} field is required.`)
        }
      }

      console.log({ invalidFields });
      setErrorFields(prevState => Array.from(new Set([...errorFields, ...invalidFields])))
    }

    return invalidFields.length === 0
  }

  // fetch all room types
  useEffect(() => {
    allKitchenBarOrders(1,1000)
        .then(res => {
          console.log("Orders: ",{res})
          setAllOrders(res)
        })
  }, []);


  const handleSaveClicked = async () => {
    const formValid = validateForm()
    console.log({formData})
    console.log({ formValid })
    console.log({ errorFields });
    if (formValid){
      setErrorFields([])

      // eslint-disable-next-line no-empty
      if (saveMode === 'save'){

      }
      else{
          editKitchenBarOrder(prevKey, formData)
              .then(res => {
                allKitchenBarOrders(1,1000)
                    .then(response => {
                      setAllOrders(response)
                    })
                // eslint-disable-next-line no-use-before-define
                handleClearClicked()
                setSaveMode('save')
              })
      }

    }

  }

  const handleClearClicked = () => {
    setFormData({
      roomNumber: '',
      status: '',
      comments: '',
      customerName: '',
    })
  }

  const handleEditIconClicked = (row) => {
    // console.log({row})
    setFormData({
      ...formData,
      ...row,
    })
    setSaveMode('edit')
    // eslint-disable-next-line no-underscore-dangle
    setPrevKey(row?._id)
  }

  const handleDeleteIconClicked = (row) => {
    console.log({row})
    // eslint-disable-next-line no-underscore-dangle
    setPrevKey(row?._id)
    setShowDeleteAlert(true)
  }

  const deleteItem = (id) => {
    editKitchenBarOrder(id, { isDeleted: true, })
        .then(res => {
          allKitchenBarOrders(1,1000)
              .then(response => {
                setAllOrders(response)
                setShowDeleteAlert(false)
              })
        })
  }

  const openItemModal = (row) => {
    setSelectedItem(row)
    setShowItem(true)
  }

  const closeItemModal = () => {
    setShowItem(false)
  }


  const ActionButtons = (props) => {
    return <div className='d-flex'>
      <button onClick={() => openItemModal(props)} type='button' className="btn btn-primary rounded-2 me-3">
        <BsEye style={{width: 15, height: 15}} />
      </button>
      <button onClick={() => handleEditIconClicked(props)} type='button' className="btn btn-secondary rounded-2 me-3">
        <FaPencil style={{width: 15, height: 15}} />
      </button>
      {/* <button onClick={() => handleDeleteIconClicked(props)} type='button' className="btn btn-danger rounded-2"> */}
      {/*  <GiTrashCan style={{width: 20, height: 20}} /> */}
      {/* </button> */}
    </div>
  }


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
        { saveMode === 'edit' && <>
          <Row className="mb-md-4">
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="customerName">Customer Name <span className='text-danger font-weight-bold'>*</span></label>
              <input disabled name='customerName' value={formData.customerName} className="form-control" onChange={handleChange} />
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="roomNumber">Room Number <span className='text-danger font-weight-bold'>*</span></label>
              <input name='roomNumber' type="text" value={formData.roomNumber} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="status">Status <span className='text-danger font-weight-bold'>*</span></label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select name='status' value={formData.status} className="form-control" onChange={handleChange}>
                <option value="">Select a status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="delivered">Delivered</option>
              </select>
            </Col>
          </Row>
          <Row className="mb-md-4">
            <Col>
              <label htmlFor="comments">Comments</label>
              <textarea name="comments" value={formData.comments} className='form-control' cols="30" rows="5" onChange={handleChange} />
            </Col>
          </Row>
          <Row className="justify-content-center mb-4 mb-md-7 mt-3 g-3">
            <Col md={2} className="align-self-center">
              <Button onClick={handleSaveClicked} className="btn btn-danger w-100 rounded-2">
                {
                  saveMode === 'save'? "Save": "Save Changes"
                } <FaFloppyDisk />
              </Button>
            </Col>
            <Col md={2} className="align-self-center">
              <Button onClick={handleClearClicked} className="btn btn-secondary w-100 rounded-2">
                {
                  saveMode === 'save'? "Clear": "Cancel"
                } <MdCancel />
              </Button>
            </Col>
          </Row>
        </>}
        <Row className='mb-4'>
          <Col className="d-flex flex-row">
            <h5 onClick={() => setTabInView('all')} className={tabInView==='all'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>All</h5>
            <h5 onClick={() => setTabInView('delivered')} className={tabInView==='delivered'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>Delivered</h5>
            <h5 onClick={() => setTabInView('in progress')} className={tabInView==='in progress'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>In Progress</h5>
            <h5 onClick={() => setTabInView('pending')} className={tabInView==='pending'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>Pending</h5>
          </Col>

        </Row>
          <Row>
            <Col>
              <GridComponent dataSource={allOrders} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
                <ColumnsDirective>
                  <ColumnDirective field='customer.name' headerText='Customer Name' width='100'/>
                  <ColumnDirective field='customer.roomNumber' headerText='Room Number' width='100' />
                  <ColumnDirective field='items' headerText='Items' width='100' />
                  <ColumnDirective field='orderDetails.totalAmount' headerText='Total' width='100' />
                  <ColumnDirective field='status' headerText='Status' width='100' />
                  <ColumnDirective headerText='Actions' template={ActionButtons} width='100'/>
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter]}/>
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
                    deleteItem(prevKey)
                  }}
                  onCancel={() => {
                    setShowDeleteAlert(false)
                  }}
              >
                Are you sure you want to delete this order?
              </SweetAlert>
          )}
          <Modal show={showItem} onHide={closeItemModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Name: </p>
                  <p className='font-weight-bold' style={{fontSize: 24}}>{selectedItem?.name}</p>
                </Col>
                <Col>
                  <p className='h5'>type: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 24}}>{selectedItem?.type}</p>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeItemModal}>
                Close
              </Button>
              <Button variant="primary" onClick={() => {
                closeItemModal()
                handleEditIconClicked(selectedItem)
              }
              }>
                Edit Item
              </Button>
            </Modal.Footer>
          </Modal>

      </>
  );
};

export default KitchenBarOrders;
