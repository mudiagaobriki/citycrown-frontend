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
import { allRoomTypes } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allFacilities, editFacility, newFacility } from '../../../services/facilityService';
import { allKitchenBarOrders } from '../../../services/KitchenBarOrderService';

const Facilities = () => {
  const title = 'Facilities';
  const description = 'Facilities';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const [images, setImages] = useState(null);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [saveMode, setSaveMode] = useState('save');
  const [prevKey, setPrevKey] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabInView, setTabInView] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bookingPrice: '',
    images: '',
  });

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [{ field: 'name', direction: 'Ascending' }] };

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Facilities' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });
  const ref = useRef();

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  useEffect(() => {
    console.log({ step });
  }, [step]);

  // useEffect(() => {
  //   console.log({formData})
  // }, [formData]);

  useEffect(() => {
    allFacilities(1, 1000).then((res) => {
      console.log('Orders: ', { res });
      if (tabInView === 'all') {
        setFacilities(res);
      } else if (tabInView === 'good') {
        const vals = res?.filter((el) => el?.healthStatus === '' || el?.healthStatus === undefined || el?.healthStatus === 'good');
        setFacilities(vals);
      } else if (tabInView === 'faulty') {
        const vals = res?.filter((el) => el?.healthStatus === 'faulty');
        setFacilities(vals);
      } else if (tabInView === 'available') {
        const vals = res?.filter((el) => el?.isAvailable === true || el?.isAvailable === undefined);
        setFacilities(vals);
      } else if (tabInView === 'booked') {
        const vals = res?.filter((el) => el?.isAvailable === false);
        setFacilities(vals);
      }
    });
  }, [tabInView]);

  useEffect(() => {
    // console.log({formData})
    if (uploadFinished && formData?.name !== '') {
      if (saveMode === 'save') {
        newFacility(formData).then((res) => {
          allFacilities(1, 1000).then((response) => {
            setFacilities(response);
          });
          // eslint-disable-next-line no-use-before-define
          handleClearClicked();
        });
      } else {
        console.log({ formData });
        // eslint-disable-next-line no-underscore-dangle
        if (formData?._id) {
          editFacility(prevKey, formData).then((res) => {
            allFacilities(1, 1000).then((response) => {
              setFacilities(response);
            });
            // eslint-disable-next-line no-use-before-define
            handleClearClicked();
            setSaveMode('save');
          });
        }
      }
    }
  }, [uploadFinished]);

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
      const imageRef = storageRef(storage, `facilities/${formData.name}-${i}`);

      uploadBytes(imageRef, imageName[i])
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              console.log(url);
              imgUrls.push(url);

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

    if (step === 0) {
      const requiredFields = ['name', 'description', 'bookingPrice'];

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
    allFacilities(1, 1000).then((res) => {
      console.log({ res });
      setFacilities(res);
    });
  }, []);

  const handleSaveClicked = async () => {
    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });
    setLoading(true);
    if (formValid) {
      setErrorFields([]);
      // setStep((prevState) => prevState + 1);
      await uploadImage();
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

  const handleEditIconClicked = (row) => {
    // console.log({row})
    setFormData({
      ...formData,
      ...row,
    });
    setSaveMode('edit');
    setPrevKey(row?.name);
  };

  const handleDeleteIconClicked = (row) => {
    setPrevKey(row?.name);
    setShowDeleteAlert(true);
  };

  const deleteItem = (name) => {
    editFacility(name, { isDeleted: true }).then((res) => {
      allFacilities(1, 1000).then((response) => {
        setFacilities(response);
        setShowDeleteAlert(false);
      });
    });
  };

  const openItemModal = (row) => {
    setSelectedItem(row);
    setShowItem(true);
  };

  const closeItemModal = () => {
    setShowItem(false);
  };

  const ActionButtons = (props) => {
    return (
      <div className="d-flex">
        <button onClick={() => openItemModal(props)} type="button" className="btn btn-primary rounded-2 me-3">
          <BsEye style={{ width: 15, height: 15 }} />
        </button>
        <button onClick={() => handleEditIconClicked(props)} type="button" className="btn btn-secondary rounded-2 me-3">
          <FaPencil style={{ width: 15, height: 15 }} />
        </button>
        <button onClick={() => handleDeleteIconClicked(props)} type="button" className="btn btn-danger rounded-2">
          <GiTrashCan style={{ width: 20, height: 20 }} />
        </button>
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
      {step === 0 && (
        <>
          <Row className="mb-md-4">
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="name">
                Name <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="name" type="text" value={formData.name} className="form-control" onChange={handleChange} />
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="description">
                Description <span className="text-danger font-weight-bold">*</span>
              </label>
              <input name="description" type="text" value={formData.description} className="form-control" onChange={handleChange} />
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="bookingPrice">Booking Price </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <input name="bookingPrice" value={formData.bookingPrice} className="form-control" onChange={handleChange} />
            </Col>
          </Row>
          <Row className="mb-md-4">
            <Col md={4} className="mb-4 mb-md-0">
              <label htmlFor="images">Images </label>
              <input ref={ref} name="images" type="file" multiple accept="image/*" min={0} className="form-control" onChange={handleImagesSelected} />
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
          <Row className="mb-4">
            <Col className="d-flex flex-row">
              <h5
                onClick={() => setTabInView('all')}
                className={tabInView === 'all' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
              >
                All
              </h5>
              <h5
                onClick={() => setTabInView('good')}
                className={tabInView === 'good' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
              >
                Good
              </h5>
              <h5
                onClick={() => setTabInView('faulty')}
                className={tabInView === 'faulty' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
              >
                Faulty
              </h5>
              <h5
                onClick={() => setTabInView('available')}
                className={tabInView === 'available' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
              >
                Available
              </h5>
              <h5
                onClick={() => setTabInView('booked')}
                className={tabInView === 'booked' ? 'text-decoration-underline font-weight-bold text-primary me-4' : 'me-4 cursor-pointer'}
              >
                Booked
              </h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <GridComponent dataSource={facilities} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
                <ColumnsDirective>
                  <ColumnDirective field="name" headerText="Name" width="100" />
                  <ColumnDirective field="description" headerText="Description" width="100" />
                  <ColumnDirective field="bookingPrice" headerText="Booking Price" width="100" />
                  <ColumnDirective field="images" headerText="Images" width="100" />
                  <ColumnDirective headerText="Actions" template={ActionButtons} width="100" />
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter]} />
              </GridComponent>
            </Col>
          </Row>
          {showDeleteAlert && (
            <SweetAlert
              title="Delete facility"
              info
              showCancel
              confirmBtnBsStyle="warning"
              confirmBtnText="Delete"
              // cancelBtnBsStyle="danger"
              onConfirm={() => {
                deleteItem(prevKey);
              }}
              onCancel={() => {
                setShowDeleteAlert(false);
              }}
            >
              Are you sure you want to delete this facility?
            </SweetAlert>
          )}
          <Modal show={showItem} onHide={closeItemModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Facility</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-2">
                <Col>
                  <p className="h5">Name: </p>
                  <p className="font-weight-bold" style={{ fontSize: 24 }}>
                    {selectedItem?.name}
                  </p>
                </Col>
                <Col>
                  <p className="h5">Booking Price: </p>
                  <p className="font-weight-bold text-capitalize" style={{ fontSize: 24 }}>
                    {selectedItem?.bookingPrice}
                  </p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <p className="h5">Description: </p>
                  <p className="font-weight-bold" style={{ fontSize: 24 }}>
                    {selectedItem?.description}
                  </p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <p className="h5">Images: </p>
                  {selectedItem?.images?.map((item, index) => {
                    return <img key={index} src={item} alt={`facility image ${index}`} style={{ width: 200, height: 200 }} />;
                  })}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeItemModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  closeItemModal();
                  handleEditIconClicked(selectedItem);
                }}
              >
                Edit Item
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default Facilities;
