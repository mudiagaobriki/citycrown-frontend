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

const RoomTypes = () => {
  const title = 'Room Types';
  const description = 'Room Types';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [allTypes, setAllTypes] = useState([]);
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
    name: '',
    price: '',
    amenities: [],
    services: [],
    discount: '',
    weekendPrice: '',
  });

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [
      { field: 'name', direction: 'Ascending' }
    ] };


  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Room Types' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });
  const ref = useRef()

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  useEffect(() => {
    console.log({step})
  }, [step]);

  // useEffect(() => {
  //   console.log({formData})
  // }, [formData]);

  useEffect(() => {
    // console.log({formData})
    if (uploadFinished && formData?.name !== ''){
      // if (saveMode === 'save'){
      //   newAmenity(formData)
      //       .then(res => {
      //         allRoomTypes(1,1000)
      //             .then(response => {
      //               setAllTypes(response)
      //             })
      //         // eslint-disable-next-line no-use-before-define
      //         handleClearClicked()
      //       })
      // }
      // else{
      //   console.log({formData})
      //   // eslint-disable-next-line no-underscore-dangle
      //   if (formData?._id){
      //     editAmenity(prevKey, formData)
      //         .then(res => {
      //           allRoomTypes(1,1000)
      //               .then(response => {
      //                 setAllTypes(response)
      //               })
      //           // eslint-disable-next-line no-use-before-define
      //           handleClearClicked()
      //           setSaveMode('save')
      //         })
      //   }
      // }
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
    console.log("Images: ", e.target.files)
    setImageName(e.target.files)
  }

  const uploadImage = async () => {
    const imgUrls = []
    setUploadFinished(false)

    if (imageName?.length === 0){
      setUploadFinished(true)
      return
    }
    // eslint-disable-next-line no-plusplus
    for (let i=0; i<imageName?.length; i++){
      if (imageName[i] === null) {
        toast.error("Please select an image");
        setUploadFinished(true)
        return;
      }
      const imageRef = storageRef(storage, `amenities/${formData.name}-${i}`);

      uploadBytes(imageRef, imageName[i])
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
                .then((url) => {
                  console.log(url);
                  imgUrls.push(url)

                  if (i === imageName?.length - 1){
                    setFormData({
                      ...formData, images: imgUrls
                    })
                    setUploadFinished(true)
                  }
                })
                .catch((error) => {
                  toast.error(error.message);
                  setUploadFinished(true)
                });
          })
          .catch((error) => {
            toast.error(error.message);
            setUploadFinished(true)
          });
    }
  }

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = []

    if (step === 0){
      const requiredFields = ['name', 'description', 'category']

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
    allRoomTypes(1,1000)
        .then(res => {
          console.log({res})
          setAllTypes(res)
        })
    allServices(1,1000)
        .then(res => {
          console.log('All services: ', {res})
          setServices(res?.map(el => {
            // eslint-disable-next-line no-underscore-dangle
            return {text: el?.name, value: el?._id}
          }))
        })
    allAmenities(1,1000)
        .then(res => {
          console.log('All amenities: ', {res})
          setAmenities(res?.map(el => {
            return {text: el?.name, value: el?.value}
          }))
        })
  }, []);


  const handleSaveClicked = async () => {
    const formValid = validateForm()
    console.log({ formValid })
    console.log({ errorFields });
    if (formValid){
      setErrorFields([])

      if (saveMode === 'save'){
        newRoomType(formData)
            .then(res => {
              allRoomTypes(1,1000)
                  .then(response => {
                    setAllTypes(response)
                  })
              // eslint-disable-next-line no-use-before-define
              handleClearClicked()
            })
      }
      else{
          editRoomType(prevKey, formData)
              .then(res => {
                allRoomTypes(1,1000)
                    .then(response => {
                      setAllTypes(response)
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
      name: '',
      price: '',
      amenities: [],
      services: [],
      discount: '',
      weekendPrice: '',
    })
  }

  const handleEditIconClicked = (row) => {
    // console.log({row})
    setFormData({
      ...formData,
      ...row,
    })
    setSaveMode('edit')
    setPrevKey(row?.name)
  }

  const handleDeleteIconClicked = (row) => {
    setPrevKey(row?.name)
    setShowDeleteAlert(true)
  }

  const deleteItem = (name) => {
    editAmenity(name, { isDeleted: true, })
        .then(res => {
          allRoomTypes(1,1000)
              .then(response => {
                setAllTypes(response)
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

  const onChangeServices = (e) => {
    // console.log('Values: ', e?.value)
    setFormData({
      ...formData,
      services: e?.value
    })
  }

  const onChangeAmenities = (e) => {
    // console.log('Values: ', e?.value)
    setFormData({
      ...formData,
      amenities: e?.value
    })
  }


  const ActionButtons = (props) => {
    return <div className='d-flex'>
      <button onClick={() => openItemModal(props)} type='button' className="btn btn-primary rounded-2 me-3">
        <BsEye style={{width: 15, height: 15}} />
      </button>
      <button onClick={() => handleEditIconClicked(props)} type='button' className="btn btn-secondary rounded-2 me-3">
        <FaPencil style={{width: 15, height: 15}} />
      </button>
      <button onClick={() => handleDeleteIconClicked(props)} type='button' className="btn btn-danger rounded-2">
        <GiTrashCan style={{width: 20, height: 20}} />
      </button>
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
        { step === 0 && <>
          <Row className="mb-md-4">
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="name">Name <span className='text-danger font-weight-bold'>*</span></label>
              <input name='name' type="text" value={formData.name} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="price">Price <span className='text-danger font-weight-bold'>*</span></label>
              <input name='price' type="text" value={formData.price} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="amenities">Amenities </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <MultiSelectComponent id='mtselement' dataSource={amenities} value={formData.amenities} change={onChangeAmenities}/>
              {/* <select name='amenities' value={formData.amenities} className="form-control" onChange={handleChange}> */}
              {/*  <option value="">Select an amenity</option> */}
              {/*  <option value="general">General</option> */}
              {/* </select> */}
            </Col>
          </Row>
          <Row className="mb-md-4">
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="services">Services </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <MultiSelectComponent id='mtselement' dataSource={services} value={formData.services} change={onChangeServices}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="discount">Discount </label>
              <input name='discount' type="text" value={formData.discount} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="weekendPrice">Weekend Price </label>
              <input name='weekendPrice' type="text" value={formData.weekendPrice} className="form-control" onChange={handleChange}/>
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
          <Row>
            <Col>
              <GridComponent dataSource={allTypes} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
                <ColumnsDirective>
                  <ColumnDirective field='name' headerText='Name' width='100'/>
                  <ColumnDirective field='price' headerText='price' width='100'/>
                  <ColumnDirective field='discount' headerText='Discount' width='100'/>
                  <ColumnDirective field='weekendPrice' headerText='Weekend Price' width='100'/>
                  <ColumnDirective headerText='Actions' template={ActionButtons} width='100'/>
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter]}/>
              </GridComponent>
            </Col>
          </Row>
          {showDeleteAlert && (
              <SweetAlert
                  title="Delete amenity"
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
                Are you sure you want to delete this amenity?
              </SweetAlert>
          )}
          <Modal show={showItem} onHide={closeItemModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Amenity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Name: </p>
                  <p className='font-weight-bold' style={{fontSize: 24}}>{selectedItem?.name}</p>
                </Col>
                <Col>
                  <p className='h5'>Category: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 24}}>{selectedItem?.category}</p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Description: </p>
                  <p className='font-weight-bold' style={{fontSize: 24}}>{selectedItem?.description}</p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Images: </p>
                  {
                    selectedItem?.images?.map((item, index) => {
                      return <img key={index} src={item} alt={`amenity image ${index}`} style={{width: 200, height: 200}} />
                    })
                  }
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
        </>}

      </>
  );
};

export default RoomTypes;
