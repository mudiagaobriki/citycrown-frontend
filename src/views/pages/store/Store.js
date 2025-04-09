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
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';
import { GiTrashCan } from 'react-icons/gi';
import SweetAlert from 'react-bootstrap-sweetalert';
// import { allRoomTypes } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allStores, newStore, editStore } from '../../../services/storeService';
import { allStoreCategories } from '../../../services/storeCategoryService';

const Store = () => {
  const title = 'Store';
  const description = 'Store';

  const ref = useRef();

  const [loading, setLoading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [imageName, setImageName] = useState('');
  const [saveMode, setSaveMode] = useState('save');
  const [errorFields, setErrorFields] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [prevKey, setPrevKey] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bookingPrice: '',
    images: '',
  });

  useEffect(() => {
    allStoreCategories(1, 1000).then((response) => {
      console.log({ resCat: response });
      setStoreCategories(response);
    });
  }, []);

  useEffect(() => {
    console.log({ storeItems });
  }, [storeItems]);

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [{ field: 'name', direction: 'Ascending' }] };

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/store', text: 'Store' },
  ];

  const { currentUser } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImagesSelected = (e) => {
    console.log('Images: ', e.target.files);
    setImageName(e.target.files);
  };

  const uploadImage = async () => {
    const imgUrls = [];
    setUploadFinished(false);

    if (imageName?.length === 0) {
      setUploadFinished(true);
      return;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < imageName?.length; i++) {
      if (imageName[i] === null) {
        toast.error('Please select an image');
        setUploadFinished(true);
        return;
      }
      const imageRef = storageRef(storage, `store/${formData.name}-${i}`);

      setLoading(true);
      uploadBytes(imageRef, imageName[i])
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              console.log(url);
              imgUrls.push(url);

              console.log({ imgUrls });

              if (i === imageName?.length - 1) {
                setFormData({
                  ...formData,
                  images: imgUrls,
                });
                setUploadFinished(true);
              }
            })
            .catch((error) => {
              toast.error(error.message);
              setUploadFinished(true);
            });
        })
        .catch((error) => {
          toast.error(error.message);
          setUploadFinished(true);
        });
    }
  };

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = [];

    // if (step === 0) {
    const requiredFields = ['name', 'category', 'costPrice', 'salePrice', 'quantity', 'unit', 'expiryDate', 'description'];

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

  const handleSaveClicked = async () => {
    setLoading(true);
    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });

    if (formValid) {
      setLoading(true);
      setErrorFields([]);
      // setStep((prevState) => prevState + 1);
      await uploadImage();
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleClearClicked = () => {
    setFormData({
      name: '',
      description: '',
      bookingPrice: '',
      images: '',
    });

    // clear the input ref
    ref.current.value = '';
  };

  useEffect(() => {
    // console.log({formData})
    if (uploadFinished && formData?.name !== '') {
      if (saveMode === 'save') {
        setLoading(true);
        newStore(formData)
          .then((res) => {
            setLoading(false);
            console.log({ formRes: res });
            if (res?.success) {
              toast.success(res?.message);
              window.location.href = '/store/store-list';
              // allStores(1, 1000).then((response) => {
              //   setStoreItems(response);
              // });
            } else {
              toast.error(res?.message);
            }

            // eslint-disable-next-line no-use-before-define
            setUploadFinished(false);
            handleClearClicked();
          })
          .catch((e) => {
            console.log({ Err: e.response.data.message });
            toast.error(e?.response?.data?.message);
            setLoading(false);
          });
      } else {
        console.log({ formData });
        // eslint-disable-next-line no-underscore-dangle
        if (formData?._id) {
          editStore(prevKey, formData).then((res) => {
            allStores(1, 1000).then((response) => {
              setStoreItems(response);
            });
            // eslint-disable-next-line no-use-before-define
            handleClearClicked();
            setSaveMode('save');
          });
        }
      }
    }
  }, [uploadFinished]);

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
          <label htmlFor="name">
            Name <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="name" type="text" value={formData.name} className="form-control" onChange={handleChange} />
        </Col>
        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="category">
            Category <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select name="category" value={formData.category} className="form-control" onChange={handleChange}>
            <option value="">Select a store category</option>
            {storeCategories &&
              storeCategories.map((el, index) => (
                <option value={el?.name} key={index}>
                  {el?.name}
                </option>
              ))}
            {/* <option value="general">General</option>
            <option value="category 2">Category 2</option> */}
          </select>
        </Col>
        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="costPrice">
            Cost Price <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="costPrice" type="text" value={formData.costPrice} className="form-control" onChange={handleChange} />
        </Col>
        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="salePrice">
            Sale Price <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <input name="salePrice" value={formData.salePrice} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="quantity">
            Quantity <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <input name="quantity" type="number" value={formData.quantity} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="unit">
            Unit <span className="text-danger font-weight-bold">*</span>
          </label>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select name="unit" value={formData.unit} className="form-control" onChange={handleChange}>
            <option value="">Select a unit</option>
            <option value="Pieces">Pieces</option>
            <option value="Rolls">Rolls</option>
            <option value="Packs">Packs</option>
            <option value="Packs">Cartons</option>
          </select>
        </Col>

        <Col md={4} className="mb-4 mb-md-2">
          <label htmlFor="expiryDate">
            Expiry Date <span className="text-danger font-weight-bold">*</span>
          </label>
          <input name="expiryDate" type="date" value={formData.expiryDate} className="form-control" onChange={handleChange} />
        </Col>

        <Col md={8} className="mb-4 mb-md-2">
          <label htmlFor="images">
            Images <span className="text-danger font-weight-bold">*</span>
          </label>
          <input ref={ref} name="images" type="file" multiple accept="image/*" min={0} className="form-control" onChange={handleImagesSelected} />
        </Col>

        <Col md={12} className="mb-4 mb-md-2">
          <label htmlFor="name">
            Description <span className="text-danger font-weight-bold">*</span>
          </label>
          <textarea name="description" value={formData.description} className="form-control" cols="30" rows="5" onChange={handleChange} />
        </Col>
      </Row>

      <Row className="justify-content-center mb-4 mb-md-7">
        <Col md={3} className="align-self-center">
          <Button disabled={loading} onClick={handleSaveClicked} style={{ height: 45 }} className="btn-danger btn-large w-100 rounded-2">
            {saveMode === 'save' ? 'Save' : 'Save Changes'} <FaFloppyDisk />
          </Button>
        </Col>
        <Col md={3} className="align-self-center">
          <Button disabled={loading} onClick={handleClearClicked} style={{ height: 45 }} className="btn-secondary btn-large w-100 rounded-2">
            {saveMode === 'save' ? 'Clear' : 'Cancel'} <MdCancel />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Store;
