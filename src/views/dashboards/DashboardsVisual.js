import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Table, InputGroup, Form } from 'react-bootstrap';
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
import { FaSackDollar } from 'react-icons/fa6';
import { BsArrowLeft, BsArrowRight, BsPerson, BsCalendar, BsPhone, BsImages, BsGeoAlt, BsHouse, BsGenderAmbiguous } from 'react-icons/bs';
import * as Yup from 'yup';
import { BiSearch } from 'react-icons/bi';
import Fuse from 'fuse.js';
import ChartDoughnut from '../interface/plugins/chart/ChartDoughnut';
import ChartPie from '../interface/plugins/chart/ChartPie';
import ChartRadar from '../interface/plugins/chart/ChartRadar';
// import {allInvestments, newInvestment} from '../../services/investmentService';
import RoomItem from '../../components/room/RoomItem';
import room from '../../assets/rooms/room-2.jpg';
import { allRooms, editRoom } from '../../services/roomService';
import { allRoomTypes } from '../../services/roomTypeService';
import { allProfiles, newProfile } from '../../services/profileService';
import { newBooking } from '../../services/bookingService';

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
  const [customerType, setCustomerType] = useState('existing');
  // const [investments, setInvestments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expectedAmt, setExpectedAmt] = useState(0);
  const [errorFields, setErrorFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    country: '',
    countryCode: '',
    gender: 'male',
    dateOfBirth: '',
    phone: '',
    altPhone: '',
    email: '',
    city: '',
    address: '',
    zip: '',
    imageUrl: '',
    otherImages: [],
    type: 'customer',
    maritalStatus: 'single',
    marriageAnniversary: '',
    nextOfKinContact: '',
    nextOfKin: '',
    _id: '',
  });

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    bookingDate: new Date(),
    durationOfStay: '',
    adults: 1,
    kids: 0,
    room: [],
    paymentMode: '',
    expectedAmount: '',
    paid: '',
    balance: '',
    customer: '',
    notes: '',
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

  // useEffect(() => {
  //   allInvestments(1, 1000).then((res) => {
  //         setInvestments(res)
  //       })
  // }, []);

  useEffect(() => {
    allProfiles(1, 1000).then((res) => {
      const c = res?.filter((el) => el?.type.toLowerCase() === 'customer');
      console.log('Customers: ', { c });
      setCustomers(c);
    });
  }, []);

  useEffect(() => {
    console.log({ step });
  }, [step]);

  // get the rooms
  useEffect(() => {
    allRooms(1, 1000).then((res) => {
      // filter rooms to get the available rooms
      let availableRooms = res?.filter((el) => el?.isDeleted !== true && el?.isBooked !== true);
      // console.log({availableRooms})
      setRooms(availableRooms);
      // restructure the object
      availableRooms = availableRooms?.map((el) => {
        return {
          item: { ...el },
        };
      });
      console.log({ availableRooms });
      setSearchResults(availableRooms);
    });
    allRoomTypes(1, 1000).then((res) => {
      // console.log("Room types:  ", res)
      setRoomTypes(res);
    });
  }, []);

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

    if (name === 'paid') {
      const bal = Number(expectedAmt) - Number(value);
      console.log({ bal });
      setBookingData({
        ...bookingData,
        balance: bal,
        [name]: value,
      });
    }

    // update the duration of stay in days
    if (name === 'checkOut') {
      const differenceInDays = new Date(value).getDate() - new Date(bookingData?.checkIn).getDate();
      setBookingData({
        ...bookingData,
        durationOfStay: differenceInDays,
        checkOut: value,
      });
    }
  };

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = [];

    if (step === 0) {
      const requiredFields = ['checkIn', 'checkOut', 'durationOfStay', 'adults', 'kids'];

      // get all the keys of the booking form
      const keys = Object.keys(bookingData);

      // loop through and get invalid fields
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (bookingData[key] === '' && requiredFields?.includes(key)) {
          invalidFields.push(key);
          toast.error(`The ${key} field is required.`);
        }
      }

      console.log({ invalidFields });
      setErrorFields((prevState) => Array.from(new Set([...errorFields, ...invalidFields])));
    }

    return invalidFields.length === 0;
  };

  const handleNextClicked = () => {
    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });
    if (formValid && step === 1) {
      // check if at least one room is selected
      if (!bookingData?.room?.length) {
        toast.error('Select one or more rooms to proceed');
        return;
      }
    }
    if (formValid && step < 3) {
      // 3 is the maximum steps (number of forms used)
      setErrorFields([]);
      setStep((prevState) => prevState + 1);
    }
  };

  const handlePreviousClicked = () => {
    if (step > 0) setStep((prevState) => prevState - 1);
  };

  const handleSearch = (str, limited = null) => {
    if (str === '') {
      const availableRooms = rooms?.map((el) => {
        return {
          item: { ...el },
        };
      });
      setSearchResults(availableRooms);
      return;
    }
    let objKeys = Object.keys(rooms[0]);

    if (limited !== null) objKeys = objKeys?.filter((el) => el === limited);
    // console.log({objKeys})
    const fuse = new Fuse(rooms, { keys: objKeys });
    const results = fuse.search(str);
    console.log({ results });
    setSearchResults(results);
  };

  useEffect(() => {
    console.log({ searchQuery });
    if (rooms?.length > 0) handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSelectRoom = (id) => {
    console.log({ id });
    // eslint-disable-next-line no-underscore-dangle
    const selectedRoom = rooms?.find((el) => el?._id === id);

    // If item exists, remove it from the array
    if (bookingData?.room?.includes(id)) {
      const newRooms = bookingData.room.filter((roomId) => roomId !== id);
      setBookingData({
        ...bookingData,
        room: newRooms,
      });
      setExpectedAmt(Number(expectedAmt) - Number(selectedRoom?.bonusPrice));
    } else {
      setBookingData({
        ...bookingData,
        room: [...new Set([...bookingData?.room, id])],
      });
      setExpectedAmt(Number(expectedAmt) + Number(selectedRoom?.bonusPrice));
    }

    console.log({ selectedRoom });
    console.log({ expectedAmt });
  };

  useEffect(() => {
    console.log({ bookingData });
  }, [bookingData]);

  const handleSelectCustomer = (id) => {
    // eslint-disable-next-line no-underscore-dangle
    const selectedCustomer = customers?.find((item) => item?._id === id);
    setFormData(selectedCustomer);
  };

  const handleUpdateNotes = (e) => {
    const { value } = e?.target;
    // console.log({value})
    setBookingData({
      ...bookingData,
      notes: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    let customerId = '';

    if (customerType === 'new') {
      const res = await newProfile(formData);
      if (res.status === 'success') {
        console.log({ res });
        toast.success('New customer added successfully. ');
        // eslint-disable-next-line no-underscore-dangle
        customerId = res?.data?._id;
      }
    } else {
      console.log('old customer....');
      // eslint-disable-next-line no-underscore-dangle
      customerId = formData?._id;
      console.log('FD::', formData);
    }

    // setBookingData(prevState => {
    //   return {
    //     ...prevState,
    //     // eslint-disable-next-line no-underscore-dangle
    //     customer: customerId,
    //     expectedAmount: expectedAmt,
    //   }
    // })
    setBookingData((prevState) => {
      const updatedData = {
        ...prevState,
        customer: customerId,
        expectedAmount: expectedAmt,
      };
      console.log('Updated Booking Data:', updatedData);
      return updatedData;
    });
    // console.log({formData})
    console.log({ bookingData });

    // save booking
    // make room status changed to booked, i.e. isBooked = true

    if (bookingData?.customer !== '') {
      const res = await newBooking(bookingData);
      console.log({ res });
      if (res.status === 'success') {
        // set status of selected rooms as booked
        // eslint-disable-next-line no-underscore-dangle
        const selectedRooms = rooms?.filter((el) => bookingData?.rooms?.include(el?._id));
        console.log({ selectedRooms });

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < selectedRooms?.length; i++) {
          editRoom(selectedRooms[i]?.number, { isBooked: true })
            .then((roomEdited) => {
              console.log({ roomEdited });
            })
            .catch((err) => {
              console.log({ err });
            });
        }

        toast.success('Customer checked in successfully.');

        // setTimeout(() => window.location.reload(), 5000)
        // eslint-disable-next-line no-underscore-dangle
      } else {
        toast.error('Error in checking customer in');
      }
    } else {
      console.log('Customer id not appended');
    }

    setLoading(false);
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
      {step === 0 && (
        <>
          <Row className="mb-md-4">
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="checkIn">
                Check In <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="checkIn" type="date" value={bookingData.checkIn} className="form-control" onChange={handleBookingDataChange} />
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="checkOut">
                Check Out <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="checkOut"
                type="date"
                min={bookingData?.checkIn ? new Date(bookingData.checkIn).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                value={bookingData.checkOut}
                className="form-control"
                onChange={handleBookingDataChange}
              />
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="durationOfStay">
                Duration of Stay (days) <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="durationOfStay" type="text" value={bookingData.durationOfStay} className="form-control" onChange={handleBookingDataChange} />
            </Col>
          </Row>
          <Row className="mb-4 mb-md-7">
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="adults">
                Adults <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="adults" type="number" value={bookingData.adults} min={0} className="form-control" onChange={handleBookingDataChange} />
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="kids">
                Children <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="kids" type="number" value={bookingData.kids} min={0} className="form-control" onChange={handleBookingDataChange} />
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Col md={2} className="align-self-end">
              <Button onClick={handleNextClicked} className="btn-primary btn-large rounded-2">
                Next <BsArrowRight />
              </Button>
            </Col>
          </Row>
        </>
      )}
      {step === 1 && (
        <>
          <Row className="mb-md-4">
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="checkin">
                Room Type <span className="text-danger font-weight-bold">*</span>
              </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select className="form-control form-select" name="room-type" id="room-type" onChange={(e) => handleSearch(e?.target?.value, 'type')}>
                <option value="">Select the room type</option>
                {roomTypes?.map((rt, index) => {
                  return (
                    <option key={index} value={rt?.name}>
                      {rt?.name}
                    </option>
                  );
                })}
              </select>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="checkout">
                Search <span className="text-danger font-weight-bold">*</span>
              </label>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Room name or number"
                  aria-label="Room name or number"
                  aria-describedby="Room name or number"
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                />
                <Button variant="outline-primary" id="button-search">
                  <BiSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <Row className="mb-4">
            {searchResults?.map((rm, index) => {
              return (
                <Col key={index} md={4} className="mb-4 mb-md-2">
                  {/* eslint-disable-next-line no-underscore-dangle */}
                  <RoomItem
                    // eslint-disable-next-line no-underscore-dangle
                    selected={bookingData?.room?.includes(rm?.item?._id)}
                    // eslint-disable-next-line no-underscore-dangle
                    onSelected={() => handleSelectRoom(rm?.item?._id)}
                    name={rm?.item?.name}
                    height={250}
                    price={rm?.item?.bonusPrice}
                    src={rm?.item?.images?.[0]}
                  />
                </Col>
              );
            })}
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
        </>
      )}
      {step === 2 && (
        <>
          <Row className="mb-md-4">
            <Col md={6} className="mb-4 mb-md-0">
              <label htmlFor="checkin">
                Guest <span className="text-danger font-weight-bold">*</span>
              </label>
              <div key="d-flex" className="mb-3">
                <Form.Check
                  inline
                  label="Existing Customer"
                  name="customers"
                  type="radio"
                  id="existing-customer"
                  checked={customerType === 'existing'}
                  onClick={() => setCustomerType('existing')}
                />
                <Form.Check
                  inline
                  label="New Customer"
                  name="customers"
                  type="radio"
                  id="new-customer"
                  checked={customerType === 'new'}
                  onClick={() => setCustomerType('new')}
                />
              </div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="checkout">
                Customer <span className="text-danger font-weight-bold">*</span>
              </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select
                disabled={customerType === 'new'}
                onChange={(e) => handleSelectCustomer(e?.target?.value)}
                className="form-control form-select"
                name="room-type"
                id="room-type"
              >
                <option value="">Select the customer</option>
                {customers?.map((cus, index) => {
                  // eslint-disable-next-line no-underscore-dangle
                  return <option key={index} value={cus?._id}>{`${cus?.firstName} ${cus?.otherNames ? cus?.otherNames : ''} ${cus?.lastName}`}</option>;
                })}
              </select>
            </Col>
          </Row>
          <>
            <Row className="mb-2 mt-7">
              <Col>
                <h4>Basic Details</h4>
              </Col>
            </Row>
            <hr className="mt-1" />
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input type="text" className="form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="col">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="otherNames" className="form-label">
                  Other Names
                </label>
                <input type="text" className="form-control" placeholder="Other Names" name="otherNames" value={formData.otherNames} onChange={handleChange} />
              </div>
              <div className="col">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select name="gender" id="gender" value={formData?.gender} className="form-control form-select">
                  <option value="">Select a gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input type="text" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <Row className="mb-2 mt-7">
              <Col>
                <h4>Contact Details</h4>
              </Col>
            </Row>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="col">
                <label htmlFor="altPhone" className="form-label">
                  Alternate Phone
                </label>
                <input type="text" className="form-control" placeholder="Alternate Phone" name="altPhone" value={formData.altPhone} onChange={handleChange} />
              </div>
            </div>
            <Row className="mb-2 mt-7">
              <Col>
                <h4>Address</h4>
              </Col>
            </Row>
            <hr className="mt-1" />
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input type="text" className="form-control" placeholder="Country" name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div className="col">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input type="text" className="form-control" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="zip" className="form-label">
                  ZIP Code
                </label>
                <input type="text" className="form-control" placeholder="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} />
              </div>
              <div className="col">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input type="text" className="form-control" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
              </div>
            </div>
            <Row className="mb-2 mt-7">
              <Col>
                <h4>Other Details</h4>
              </Col>
            </Row>
            <hr className="mt-1" />
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="country" className="form-label">
                  Marital Status
                </label>
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select className="form-control" placeholder="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                  <option value="single">Single</option>
                  <option value="married">Marriage</option>
                  <option value="divorced">Divorced</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* <div className="col">
                <label htmlFor="marriageAnniversary" className="form-label">
                  Marriage Anniversary
                </label>
                <input type="date" className="form-control" name="marriageAnniversary" value={formData.marriageAnniversary} onChange={handleChange} />
              </div> */}

              <div className="col">
                <label htmlFor="nextOfKin" className="form-label">
                  Next Of Kin
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Next Of Kin's Name"
                  name="nextOfKin"
                  value={formData.nextOfKin}
                  onChange={handleChange}
                />
              </div>

              <div className="col">
                <label htmlFor="nextOfKinContact" className="form-label">
                  Next Of Kin Contact Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Next Of Kin's Contact Number"
                  name="nextOfKinContact"
                  value={formData.nextOfKinContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
          <Row className="justify-content-end mt-7">
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
        </>
      )}
      {step === 3 && (
        <>
          <Row className="mb-md-4">
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="payment-mode">
                Payment Mode <span className="text-danger font-weight-bold">*</span>
              </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select className="form-control form-select" name="paymentMode" id="payment-mode" onChange={handleBookingDataChange}>
                <option value="">Select the payment mode</option>
                <option value="cash">Cash</option>
                <option value="pos">POS</option>
                <option value="transfer">Transfer</option>
                <option value="bank">Bank</option>
                <option value="online">Online</option>
              </select>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="amount">
                Paid <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="paid" value={bookingData?.paid} type="text" className="form-control" id="amount" onChange={handleBookingDataChange} />
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="balance">
                Balance <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="balance"
                value={bookingData?.balance}
                type="text"
                disabled
                placeholder="Balance"
                className="form-control"
                id="balance"
                onChange={handleBookingDataChange}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col className="mb-4">
              <label htmlFor="balance">Notes/Comments </label>
              <textarea className="form-control" name="" id="notes" cols="30" rows="10" onChange={handleUpdateNotes} />
            </Col>
          </Row>
          <Row className="justify-content-end">
            <Col xs={4} md={2} className="align-self-end">
              <Button onClick={handlePreviousClicked} className="btn-light btn-large rounded-2">
                <BsArrowLeft /> Previous
              </Button>
            </Col>
            <Col xs={4} md={2} className="align-self-end">
              <Button disabled={loading} onClick={handleSave} className="btn-danger btn-large w-100 rounded-2">
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DashboardsDefault;
