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
import {allFacilityBookings, editFacilityBookings} from "../../../services/facilityBookingsService";

const FacilityBookings = () => {
  const title = 'Facility Bookings';
  const description = 'Facility Bookings';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [faciltyBookings, setFaciltyBookings] = useState([]);
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

  const [tabInView, setTabInView] = useState('all')

  const StartDateTemplate = ({startDate}) => {
    return <div className="text-capitalize">{new Date(startDate).toDateString()}</div>
  }

  const EndDateTemplate = ({endDate}) => {
    return <div className="text-capitalize">{new Date(endDate).toDateString()}</div>
  }

  const StatusTemplate = ({status}) => {
    switch (status){
      case 'pending':
        return <div className="text-capitalize bg-warning text-center">{status}</div>
      case 'confirmed':
        return <div className="text-capitalize bg-success text-center text-white">{status}</div>
      case 'cancelled':
        return <div className="text-capitalize bg-danger text-center">{status}</div>
      default:
        return <div className="text-capitalize text-center">{status}</div>
    }
  }


  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [
      { field: 'name', direction: 'Ascending' }
    ] };


  const breadcrumbs = [
    { to: '', text: 'Facility Bookings' },
    { to: 'dashboards', text: 'Facility Bookings' },
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
      const requiredFields = ['status','facility','bookedBy']

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
    allFacilityBookings(1,1000)
        .then(res => {
          console.log("Facilty Bookings: ",{res})
          if (tabInView === 'all'){
            setFaciltyBookings(res)
          }
          else{
            const vals = res?.filter(el => el?.status === tabInView)
            setFaciltyBookings(vals)
          }

        })
  }, [tabInView]);


  const handleSaveClicked = async () => {
    const formValid = validateForm()
    console.log({formData})
    console.log({ formValid })
    console.log({ errorFields });
    console.log({selectedItem})
    if (formValid){
      setErrorFields([])

      // eslint-disable-next-line no-empty
      if (saveMode === 'save'){

      }
      else{
          editFacilityBookings(prevKey, formData)
              .then(res => {
                console.log({res})
                allFacilityBookings(1,1000)
                    .then(response => {
                      setFaciltyBookings(response)
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
      facility: '',
      bookedBy: '',
      startDate: '',
      endDate: '',
      guests: '',
      depositAmount: '',
      balanceAmount: '',
      status: '',
      createdAt: '',
    })

    setSaveMode('save')
  }

  const handleEditIconClicked = (row) => {
    console.log({row})
    setFormData(row)
    setSaveMode('edit')
    // eslint-disable-next-line no-underscore-dangle
    setPrevKey(row?._id)
    setSelectedItem(row)
  }

  const handleDeleteIconClicked = (row) => {
    console.log({row})
    // eslint-disable-next-line no-underscore-dangle
    setPrevKey(row?._id)
    setShowDeleteAlert(true)
  }

  const deleteItem = (id) => {
    editFacilityBookings(id, { isDeleted: true, })
        .then(res => {
          allFacilityBookings(1,1000)
              .then(response => {
                setFaciltyBookings(response)
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
              <label htmlFor="facility">Facility Name <span className='text-danger font-weight-bold'>*</span></label>
              <input disabled name='facility' value={formData.facility?.name} className="form-control" onChange={handleChange} />
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="bookedBy">Booked By <span className='text-danger font-weight-bold'>*</span></label>
              <input name='bookedBy' type="text" value={formData.bookedBy} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="startDate">Start Date <span className='text-danger font-weight-bold'>*</span></label>
              <input name='startDate' type="date" value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''} className="form-control" onChange={handleChange}/>
            </Col>
          </Row>
          <Row className="mb-md-4">
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="endDate">End Date <span className='text-danger font-weight-bold'>*</span></label>
              <input name='endDate' type="datetime-local" value={new Date(formData.endDate)} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="guests">Guests <span className='text-danger font-weight-bold'>*</span></label>
              <input name='guests' type="text" value={formData.guests} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="depositAmount">Deposit Amount <span className='text-danger font-weight-bold'>*</span></label>
              <input name='depositAmount' type="text" value={formData.depositAmount} className="form-control" onChange={handleChange}/>
            </Col>
          </Row>
          <Row className="mb-md-4">
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="balanceAmount">Balance Amount <span className='text-danger font-weight-bold'>*</span></label>
              <input name='balanceAmount' type="text" value={formData.balanceAmount} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="status">Status <span className='text-danger font-weight-bold'>*</span></label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select name='status' value={formData.status} className="form-control" onChange={handleChange}>
                <option value="">Select a status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
            <h5 onClick={() => setTabInView('confirmed')} className={tabInView==='confirmed'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>Confirmed</h5>
            <h5 onClick={() => setTabInView('pending')} className={tabInView==='pending'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>Pending</h5>
            <h5 onClick={() => setTabInView('cancelled')} className={tabInView==='cancelled'?"text-decoration-underline font-weight-bold text-primary me-4":"me-4 cursor-pointer"}>Cancelled</h5>
          </Col>

        </Row>
          <Row>
            <Col>
              <GridComponent dataSource={faciltyBookings} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
                <ColumnsDirective>
                  <ColumnDirective field='facility.name' headerText='Facility' width='80'/>
                  <ColumnDirective field='bookedBy' headerText='Booked By' width='80' />
                  <ColumnDirective field='guests' headerText='Guests' width='100' />
                  <ColumnDirective field='startDate' headerText='Start Date' template={StartDateTemplate} width='100' />
                  <ColumnDirective field='endDate' headerText='End Date' template={EndDateTemplate} width='100' />
                  <ColumnDirective field='status' headerText='Status' template={StatusTemplate} width='100' />
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
              <Modal.Title>Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-4">
                <h3>Customer details</h3>
                <hr/>
                <Col>
                  <p className='h5'>Name: </p>
                  <p className='font-weight-bold' style={{fontSize: 16}}>{selectedItem?.customer?.name}</p>
                </Col>
                <Col>
                  <p className='h5'>Room number: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 16}}>{selectedItem?.customer?.roomNumber}</p>
                </Col>
                <Col>
                  <p className='h5'>Contact number: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 16}}>{selectedItem?.customer?.contactNumber}</p>
                </Col>
              </Row>
              <Row className="mb-4">
                <h3>Order details</h3>
                <hr/>
                <Col>
                  <p className='h5'>Order date/time: </p>
                  <p className='font-weight-bold' style={{fontSize: 16}}>{selectedItem?.orderDetails?.orderDate}</p>
                </Col>
                <Col>
                  <p className='h5'>Status: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 16}}>{selectedItem?.orderDetails?.status}</p>
                </Col>
                <Col>
                  <p className='h5'>Comments: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 16}}>{selectedItem?.orderDetails?.comments}</p>
                </Col>
              </Row>
              <Row className="mb-2">
                <h3>Items</h3>
                <hr/>
                <Col>
                  <p className='h5'>Ordered items: </p>
                  {
                    selectedItem?.orderItems?.map((item,index) => {
                      return <p key={index} className='font-weight-bold' style={{fontSize: 16}}>{item?.quantity} unit of {item?.Id?.name}</p>
                    })
                  }
                </Col>
                <Col>
                  <p className='h5'>Total Amount: </p>
                  <p className='font-weight-bolder text-capitalize' style={{fontSize: 24}}><span className="currency">&#8358; </span>
                     {selectedItem?.orderDetails?.totalAmount?.toLocaleString('en-US')}</p>
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

export default FacilityBookings;
