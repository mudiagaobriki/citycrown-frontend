import React, {useEffect, useRef, useState} from 'react';
import {Button, Row, Col, Card, Table, InputGroup, Form, } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import {NavLink, useHistory} from 'react-router-dom';
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
import {FaSave} from "react-icons/fa";
import {MdCancel} from "react-icons/md";
import {editProfile, newProfile} from "../../../services/profileService";

const NewCustomer = () => {
  const title = 'New Customer';
  const description = '';
  const pageTop = useRef(null);
  const history = useHistory();
  let cusData = history.location?.state?.data;
  cusData = cusData !== undefined ? JSON.parse(cusData) : undefined;
  console.log({cusData})

  // const [name, setName] = useState(0);
  const [email, setEmail] = useState('');
  const [saveMode, setSaveMode] = useState('save');
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
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
  });

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'New Customer' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  useEffect(() => {
    if (cusData !== undefined && cusData?.firstName){
      setFormData({
        ...formData,
        ...cusData
      })
      setSaveMode('edit')
    }
  }, []);

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


      const requiredFields = ['firstName', 'gender', 'phone', 'email',]

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

    return invalidFields.length === 0
  }

  const handleClearForm = () => {
    setFormData({
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
    })
    setSaveMode('save')
  }

  const handleSaveClicked = async () => {
    setLoading(true)
    const formValid = validateForm()
    console.log({ formValid })
    console.log({ errorFields });
    if (formValid){ // 3 is the maximum steps (number of forms used)
      setErrorFields([])
      // submit form
      console.log({formData})
      if (saveMode === 'edit'){
        // eslint-disable-next-line no-underscore-dangle
        const res = await editProfile(cusData?._id,formData)
        console.log({res})
        if (res.status === 'success'){
          toast.success('Customer profile edited successfully. ')
          handleClearForm()
          pageTop?.current?.scrollIntoView({ behavior: 'smooth' });
        }
        return;

      }
      const res = await newProfile(formData)
      if (res.status === 'success'){
        toast.success('New customer added successfully.')
        handleClearForm()
        pageTop?.current?.scrollIntoView({ behavior: 'smooth' });
      }

    }
    setLoading(false)

  }


  return (
    <>
      <HtmlHead title={title} description={description} />

      {/* Title and Top Buttons Start */}
      <div className="page-title-container mb-7" ref={pageTop}>
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

      <>
        <Row className='mb-2 mt-7'>
          <Col>
            <h4>Basic Details</h4>
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
            <select name="gender" id="gender" value={formData?.gender} className='form-control form-select'>
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
            <h4>Contact Details</h4>
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
            <h4>Address</h4>
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
        <Row className='mb-2 mt-7'>
          <Col>
            <h4>Other Details</h4>
          </Col>
        </Row>
        <hr className='mt-1'/>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="country" className="form-label">Marital Status</label>
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select className="form-control" placeholder="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
              <option value="single">Single</option>
              <option value="married">Marriage</option>
              <option value="divorced">Divorced</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col">
            <label htmlFor="marriageAnniversary" className="form-label">Marriage Anniversary</label>
            <input type="date" className="form-control" name="marriageAnniversary" value={formData.marriageAnniversary} onChange={handleChange} />
          </div>
        </div>


        <Row className="justify-content-center mt-7">
          <Col xs={4} md={2} className="align-self-end float">
            <Button onClick={handleSaveClicked} disabled={loading} style={{height: 50}} className="btn btn-primary btn-large btn-block rounded-2 w-100 text-capitalize">
              {loading? 'Saving': `${saveMode}`} <FaSave />
            </Button>
          </Col>
          <Col xs={4} md={2} className="align-self-end float">
            <Button onClick={handleClearForm} style={{height: 50}} className="btn btn-warning btn-large btn-block rounded-2 w-100">
              Clear <MdCancel />
            </Button>
          </Col>
        </Row>
      </>

    </>
  );
};

export default NewCustomer;
