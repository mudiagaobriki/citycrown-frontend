import React, { useEffect, useState } from 'react';
import {Button, Row, Col, Card, Table, InputGroup, Form, } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { NavLink } from 'react-router-dom';
import { Steps } from 'intro.js-react';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Glide from 'components/carousel/Glide';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ChartLargeLineSales from 'views/interface/plugins/chart/ChartLargeLineSales';
import ChartLargeLineStock from 'views/interface/plugins/chart/ChartLargeLineStock';
import { AdvancedRealTimeChart, CryptoCurrencyMarket, MiniChart, TickerTape } from 'react-ts-tradingview-widgets';
import 'intro.js/introjs.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {FaSackDollar} from "react-icons/fa6";
import { BsArrowLeft, BsArrowRight, BsPerson, BsCalendar, BsPhone, BsImages, BsGeoAlt, BsHouse, BsGenderAmbiguous } from 'react-icons/bs';
import * as Yup from "yup";
import {BiSearch} from "react-icons/bi";
import ChartDoughnut from '../interface/plugins/chart/ChartDoughnut';
import ChartPie from '../interface/plugins/chart/ChartPie';
import ChartRadar from '../interface/plugins/chart/ChartRadar';
import {allInvestments, newInvestment} from '../../services/investmentService';
import RoomItem from "../../components/room/RoomItem";
import room from '../../assets/rooms/room-2.jpg'


const Fincard = ({ title, amount, bgColor = '#00b8d9' }) => {
  return (
      <div
          className="p-4 rounded-2 d-flex flex-row justify-content-between align-items-center"
          style={{ borderRadius: 0.2, borderColor: '#6a7e95', borderStyle: 'groove' }}
      >
        <div>
          <p className="text-uppercase text-white-50">{title}</p>
          <h3 className="text-white font-weight-bold">${amount}</h3>
        </div>
        <div style={{ width: 60, height: 60, borderRadius: 60, backgroundColor: bgColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FaSackDollar color="white" size={30} />
        </div>
      </div>
  );
};

const DashboardsDefault = () => {
  const title = 'Customer Check-in';
  const description = 'Check-ins';

  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState(false);
  const [amountErrorText, setAmountErrorText] = useState('');
  // const [name, setName] = useState(0);
  const [email, setEmail] = useState('');
  const [investments, setInvestments] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    country: '',
    countryCode: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    altPhone: '',
    email: '',
    city: '',
    address: '',
    zip: '',
    imageUrl: '',
    otherImages: [],
    type: '',
  });

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    bookingDate: '',
    durationOfStay: '',
    adults: 1,
    kids: 0,
    room: '',
    paymentStatus: '',
    expectedAmount: '',
    totalPaid: '',
  });


  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Check-ins' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  useEffect(() => {
    allInvestments(1, 1000).then((res) => {
          setInvestments(res)
        })
  }, []);

  useEffect(() => {
    console.log({step})
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBookingDataChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });

    // update the duration of stay in days
    if (name === 'checkOut'){
      const differenceInDays = new Date(value).getDate() - new Date(bookingData?.checkIn).getDate()
      setBookingData({
        ...bookingData, durationOfStay: differenceInDays, checkOut: value
      })
    }
  };

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = []

    if (step === 0){
      const requiredFields = ['checkIn', 'checkOut', 'durationOfStay', 'adults', 'kids']

      // get all the keys of the booking form
      const keys = Object.keys(bookingData)

      // loop through and get invalid fields
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < keys.length; i++){
        const key = keys[i];
        if (bookingData[key] === "" && requiredFields?.includes(key)){
          invalidFields.push(key)
          toast.error(`The ${key} field is required.`)
        }
      }

      console.log({ invalidFields });
      setErrorFields(prevState => Array.from(new Set([...errorFields, ...invalidFields])))
    }

    return invalidFields.length === 0
  }

  const handleNextClicked = () => {
    const formValid = validateForm()
    console.log({ formValid })
    console.log({ errorFields });
    if (formValid && step < 3){ // 3 is the maximum steps (number of forms used)
      setErrorFields([])
      setStep((prevState) => prevState + 1);
    }

  }

  const handlePreviousClicked = () => {
    if (step > 0) setStep(prevState => prevState - 1)
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
      { step === 0 && <>
        <Row className="mb-md-4">
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="checkIn">Check In <span className='text-danger font-weight-bold'>*</span></label>
            <input name='checkIn' type="date" value={bookingData.checkIn} className="form-control" onChange={handleBookingDataChange}/>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="checkOut">Check Out <span className='text-danger font-weight-bold'>*</span></label>
            <input name='checkOut' type="date"
                   min={bookingData?.checkIn? new Date(bookingData.checkIn).toISOString().split("T")[0]:
                       new Date().toISOString().split("T")[0]}
                   value={bookingData.checkOut} className="form-control" onChange={handleBookingDataChange}/>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="durationOfStay">Duration of Stay (days) <span className='text-danger font-weight-bold'>*</span></label>
            <input name='durationOfStay' type="text" value={bookingData.durationOfStay} className="form-control" onChange={handleBookingDataChange}/>
          </Col>
        </Row>
        <Row className="mb-4 mb-md-7">
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="adults">Adults <span className='text-danger font-weight-bold'>*</span></label>
            <input name='adults' type="number" value={bookingData.adults} min={0} className="form-control" onChange={handleBookingDataChange}/>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="kids">Children <span className='text-danger font-weight-bold'>*</span></label>
            <input name='kids' type="number" value={bookingData.kids} min={0} className="form-control" onChange={handleBookingDataChange}/>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col md={2} className="align-self-end">
            <Button onClick={handleNextClicked} className="btn-primary btn-large rounded-2">
              Next <BsArrowRight />
            </Button>
          </Col>
        </Row>
      </>}
      { step ===1 && <>
        <Row className="mb-md-4">
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="checkin">Room Type <span className='text-danger font-weight-bold'>*</span></label>
            <select className='form-control form-select' name="room-type" id="room-type">
              <option value="">Select the room type</option>
            </select>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="checkout">Search <span className='text-danger font-weight-bold'>*</span></label>
            <InputGroup className="mb-3">
              <Form.Control
                  placeholder="Room name or number"
                  aria-label="Room name or number"
                  aria-describedby="Room name or number"
              />
              <Button variant="outline-primary" id="button-search">
                <BiSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className='mb-4'>
          <Col md={4} className='mb-4 mb-md-2'>
            <RoomItem name={101} height={50} price={25000} />
          </Col>
          <Col md={4} className='mb-4 mb-md-2'>
            <RoomItem name={101} height={50} price={25000} />
          </Col>
          <Col md={4} className='mb-4 mb-md-2'>
            <RoomItem name={101} height={50} price={25000} />
          </Col>
          <Col md={4} className='mb-4 mb-md-2'>
            <RoomItem name={101} height={50} price={25000} />
          </Col>
          <Col md={4} className='mb-4 mb-md-2'>
            <RoomItem name={101} height={50} price={25000} />
          </Col>
          <Col md={4} className='mb-4 mb-md-2'>
            <RoomItem name={101} height={50} price={25000} />
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs={4} md={2} className="align-self-end">
            <Button onClick={handlePreviousClicked} className="btn-light btn-large rounded-2">
              <BsArrowLeft /> Previous
            </Button>
          </Col>
          <Col xs={4} md={2} className="align-self-end">
            <Button onClick={handleNextClicked} className="btn-primary btn-large rounded-2">
              Next <BsArrowRight />
            </Button>
          </Col>
        </Row>
      </>}
      { step ===2 && <>
        <Row className="mb-md-4">
          <Col md={6} className='mb-4 mb-md-0'>
            <label htmlFor="checkin">Guest <span className='text-danger font-weight-bold'>*</span></label>
            <div key='d-flex' className="mb-3">
              <Form.Check
                  inline
                  label="New Customer"
                  name="customers"
                  type='radio'
                  id='new-customer'
              />
              <Form.Check
                  inline
                  label="Existing Customer"
                  name="customers"
                  type='radio'
                  id='existing-customer'
              />
            </div>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="checkout">Customer <span className='text-danger font-weight-bold'>*</span></label>
            <select className='form-control form-select' name="room-type" id="room-type">
              <option value="">Select the customer</option>
            </select>
          </Col>
        </Row>
        <Row className='mb-2 mt-7'>
          <Col>
            <h4>Customer Basic Details</h4>
          </Col>
        </Row>
        <hr className='mt-1'/>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="otherNames" className="form-label">Other Names</label>
            <input type="text" className="form-control" placeholder="Other Names" name="otherNames" value={formData.otherNames} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select name="gender" id="gender" className='form-control form-select'>
              <option value="">Select a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
            <input type="date" className="form-control" placeholder="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="text" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
          </div>
        </div>

        <Row className='mb-2 mt-7'>
          <Col>
            <h4>Customer Contact Details</h4>
          </Col>
        </Row>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="altPhone" className="form-label">Alternate Phone</label>
            <input type="text" className="form-control" placeholder="Alternate Phone" name="altPhone" value={formData.altPhone} onChange={handleChange} />
          </div>
        </div>
        <Row className='mb-2 mt-7'>
          <Col>
            <h4>Customer Address</h4>
          </Col>
        </Row>
        <hr className='mt-1'/>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="country" className="form-label">Country</label>
            <input type="text" className="form-control" placeholder="Country" name="country" value={formData.country} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="city" className="form-label">City</label>
            <input type="text" className="form-control" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="zip" className="form-label">ZIP Code</label>
            <input type="text" className="form-control" placeholder="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
          </div>
        </div>
        <Row className="justify-content-end">
          <Col xs={4} md={2} className="align-self-end">
            <Button onClick={handlePreviousClicked} className="btn-light btn-large rounded-2">
              <BsArrowLeft /> Previous
            </Button>
          </Col>
          <Col xs={4} md={2} className="align-self-end">
            <Button onClick={handleNextClicked} className="btn-primary btn-large rounded-2">
              Next <BsArrowRight />
            </Button>
          </Col>
        </Row>
      </>}
      { step ===3 && <>
        <Row className="mb-md-4">
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="payment-mode">Payment Mode <span className='text-danger font-weight-bold'>*</span></label>
            <select className='form-control form-select' name="payment-mode" id="payment-mode">
              <option value="">Select the payment mode</option>
              <option value="cash">Cash</option>
              <option value="pos">POS</option>
              <option value="transfer">Transfer</option>
              <option value="bank">Bank</option>
              <option value="online">Online</option>
            </select>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="amount">Search <span className='text-danger font-weight-bold'>*</span></label>
            <input type="text" className="form-control" id="amount"/>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="payment-proof">Search <span className='text-danger font-weight-bold'>*</span></label>
            <input type="file" placeholder='Upload proof of payment' className="form-control" id="payment-proof"/>
          </Col>
        </Row>
        <Row className='mb-4 align-items-center justify-content-center text-center'>
          <Col md={5} className='mb-4 mb-md-2 align-self-center'>
            <img src={room} className='img img-fluid w-100' alt='Image' />
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs={4} md={2} className="align-self-end">
            <Button onClick={handlePreviousClicked} className="btn-light btn-large rounded-2">
              <BsArrowLeft /> Previous
            </Button>
          </Col>
          <Col xs={4} md={2} className="align-self-end">
            <Button onClick={handleNextClicked} className="btn-danger btn-large w-100 rounded-2">
              Save
            </Button>
          </Col>
        </Row>
      </>}

    </>
  );
};

export default DashboardsDefault;
