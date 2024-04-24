import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { Button, Row, Col, Card, Table, InputGroup, Form, Modal } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
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
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';
import { GiTrashCan } from 'react-icons/gi';
import SweetAlert from 'react-bootstrap-sweetalert';
// import { allRoomTypes } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allUsers, newUser, editUser } from '../../../services/userService';
// import { allStoreCategories } from '../../../services/storeCategoryService';

const AddUser = () => {
  const title = 'Add New User';
  const description = 'Add new User';

  const ref = useRef();
  const selectedCountryRef = useRef();
  const phoneRef = useRef();

  const [loading, setLoading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [imageName, setImageName] = useState('');
  const [saveMode, setSaveMode] = useState('save');
  const [errorFields, setErrorFields] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [prevKey, setPrevKey] = useState('');

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  const [phoneNum, setPhoneNum] = useState();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    country: '',
    countryCode: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    city: '',
    address: '',
    zip: '',
    imageUrl: '',
    otherImages: '',
    type: '',
    maritalStatus: '',
    marriageAnniversary: '',
    email: '',
    images: '',
  });

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/store', text: 'Store' },
  ];

  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    fetch('https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code')
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        // setSelectedCountry(data.userSelectValue);
      });
  }, []);

  useEffect(() => {
    console.log({ selectedCountryRef, phoneRef });
  }, [selectedCountryRef, phoneRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = [];

    // if (step === 0) {
    const requiredFields = ['firstName', 'lastName', 'country', 'gender', 'dateOfBirth', 'phone', 'maritalStatus', 'email', 'password'];

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
    // }

    return invalidFields.length === 0;
  };

  const handleClearClicked = () => {
    setFormData({
      firstName: '',
      lastName: '',
      otherNames: '',
      country: '',
      countryCode: '',
      gender: '',
      dateOfBirth: '',
      phone: '',
      city: '',
      address: '',
      zip: '',
      imageUrl: '',
      otherImages: '',
      type: '',
      maritalStatus: '',
      marriageAnniversary: '',
      email: '',
      password: '',
      images: '',
    });

    // clear the input ref
    ref.current.value = '';
  };

  async function handleAddNewUser() {
    setLoading(true);
    console.log('FormD-bef::', formData);
    newUser(formData)
      .then((res) => {
        setLoading(false);
        console.log({ formRes: res });

        toast.success('User Added Successfully');
        window.location.href = '/admin/users-list';
        // allStores(1, 1000).then((response) => {
        //   setStoreItems(response);
        // });

        // eslint-disable-next-line no-use-before-define
        //    setUploadFinished(false);
        handleClearClicked();
      })
      .catch((e) => {
        console.log({ Err: e });
        if (e?.response?.data) {
          toast.error(e?.response?.data);
        } else {
          toast.error('An Unexpected Error Occured');
        }

        setLoading(false);
      });
  }

  const handleSaveClicked = async () => {
    console.log('FD_BEF_VAL::', formData);
    setLoading(true);

    const invalidFields = [];
    if (!formData.phone) {
      invalidFields.push('phone');
      toast.error(`The ${'Phone Number'} field is required.`);
      setLoading(false);
      return;
    }

    const ValidPhoneNumber = isValidPhoneNumber(formData.phone);
    if (!ValidPhoneNumber) {
      invalidFields.push('phone Number');
      toast.error(`Invalid Phone Number`);
      setLoading(false);

      return;
    }

    if (!formData.country) {
      invalidFields.push('country');
      toast.error(`The ${'Country'} field is required.`);
      setLoading(false);

      return;
    }

    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });

    if (formValid) {
      setErrorFields([]);
      // setStep((prevState) => prevState + 1);
      // await uploadImage();
      const res = await handleAddNewUser();
      console.log(res);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  function handlePhoneNumberChange(val) {
    // console.log('VVVV::', val);
    phoneRef.current = val;
    console.log('phoneRef::', phoneRef);

    setFormData({ ...formData, phone: phoneRef.current });
  }

  function handleCountryChange(e) {
    // console.log('EEEEE:', e);
    setSelectedCountry(e);
    selectedCountryRef.current = e;
    console.log('selectedCountryRef:', selectedCountryRef);

    setFormData({ ...formData, country: selectedCountryRef.current.label, countryCode: selectedCountryRef.current.value });
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

      <Row className="mb-md-4">
        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="firstName">
            First Name <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="firstName" type="text" value={formData.firstName} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="lastName">
            Last Name <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="lastName" type="text" value={formData.lastName} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="otherNames">Other Names</label>
          <input name="otherNames" type="text" value={formData.otherNames} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="email">
            Email <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="email" type="text" value={formData.email} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="password">
            Password <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="password" type="password" value={formData.password} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="dateOfBirth">Date Of Birth</label>
          <input name="dateOfBirth" type="date" value={formData.dateOfBirth} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={3} className="mb-4 mb-md-2">
          <label htmlFor="country">
            Country <span className="text-danger font-weight-bold">*</span>
          </label>
          <Select
            placeholder="Select Your Country..."
            name="country"
            options={countries}
            value={selectedCountry}
            onChange={(selectedOption) => handleCountryChange(selectedOption)}
          />
        </Col>

        <Col md={3} className="mb-4 mb-md-2">
          <label htmlFor="phone">
            Phone Number <span className="text-danger font-weight-bold">*</span>
          </label>
          <PhoneInput
            defaultCountry="NG"
            className="form-control"
            placeholder="Enter phone number"
            value={phoneNum}
            onChange={(val) => handlePhoneNumberChange(val)}
            style={{ border: 'none' }}
          />
        </Col>

        <Col md={3} className="mb-4 mb-md-2">
          <label htmlFor="gender">
            Gender <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select name="gender" value={formData.gender} className="form-control" onChange={handleChange}>
            <option value="">Select a gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Col>

        {/* <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="category">
            Category <span className="text-danger font-weight-bold">*</span>
          </label>
          
          <select name="category" value={formData.category} className="form-control" onChange={handleChange}>
            <option value="">Select a store category</option>
            {storeCategories &&
              storeCategories.map((el, index) => (
                <option value={el?.name} key={index}>
                  {el?.name}
                </option>
              ))}
            
          </select>
        </Col> */}
        <Col md={3} className="mb-4 mb-md-2">
          <label htmlFor="city">City</label>
          <input name="city" type="text" value={formData.city} className="form-control" onChange={handleChange} />
        </Col>
        <Col md={3} className="mb-4 mb-md-2">
          <label htmlFor="address">Address</label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <input name="address" value={formData.address} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={2} className="mb-4 mb-md-2">
          <label htmlFor="zip">ZIP</label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <input name="zip" type="text" value={formData.zip} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={2} className="mb-4 mb-md-2">
          <label htmlFor="type">
            Type <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select name="type" value={formData.type} className="form-control" onChange={handleChange}>
            <option value="Male" selected>
              Starter
            </option>
            <option value="Female">Admin</option>
          </select>
        </Col>

        <Col md={2} className="mb-4 mb-md-2">
          <label htmlFor="maritalStatus">
            Marital Status <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select name="maritalStatus" value={formData.maritalStatus} className="form-control" onChange={handleChange}>
            <option value="">Select your marital status</option>
            <option value="Rolls">Married</option>
            <option value="Packs">Single</option>
            <option value="Packs">Divorced</option>
          </select>
        </Col>

        <Col md={3} className="mb-4 mb-md-2">
          <label htmlFor="marriageAnniversary">Marriage Anniversary</label>
          <input name="marriageAnniversary" type="date" value={formData.marriageAnniversary} className="form-control" onChange={handleChange} />
        </Col>

        {/* <Col md={8} className="mb-4 mb-md-2">
          <label htmlFor="images">
            Images <span className="text-danger font-weight-bold">*</span>
          </label>
          <input ref={ref} name="images" type="file" multiple accept="image/*" min={0} className="form-control" onChange={handleImagesSelected} />
        </Col> */}

        {/* <Col md={12} className="mb-4 mb-md-2">
          <label htmlFor="name">
            Description <span className="text-danger font-weight-bold">*</span>
          </label>
          <textarea name="description" value={formData.description} className="form-control" cols="30" rows="5" onChange={handleChange} />
        </Col> */}
      </Row>

      <Row className="justify-content-center mb-4 mb-md-7">
        <Col md={3} className="align-self-center">
          <Button onClick={handleSaveClicked} disabled={loading} style={{ height: 45 }} className="btn-danger btn-large w-100 rounded-2">
            {saveMode === 'save' ? 'Save' : 'Save Changes'} <FaFloppyDisk />
          </Button>
        </Col>
        <Col md={3} className="align-self-center">
          <Button onClick={handleClearClicked} disabled={loading} style={{ height: 45 }} className="btn-secondary btn-large w-100 rounded-2">
            {saveMode === 'save' ? 'Clear' : 'Cancel'} <MdCancel />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AddUser;
