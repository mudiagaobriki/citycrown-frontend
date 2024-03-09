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
import {allRooms, editRoom, newRoom} from "../../../services/roomService";

const Rooms = () => {
  const title = 'Rooms';
  const description = 'Rooms';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [videoName, setVideoName] = useState('');
  const [allTypes, setAllTypes] = useState([]);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [services, setServices] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const [images, setImages] = useState(null);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [videoUploadFinished, setVideoUploadFinished] = useState(false);
  const [saveMode, setSaveMode] = useState('save');
  const [prevKey, setPrevKey] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    type: '',
    bonusPrice: '',
    images: [],
    videos: [],
  });

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [
      { field: 'name', direction: 'Ascending' }
    ] };


  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Rooms' },
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
    if (uploadFinished && videoUploadFinished){
      if (saveMode === 'save'){
        newRoom(formData)
            .then(res => {
              allRooms(1,1000)
                  .then(response => {
                    setHotelRooms(response)
                    setLoading(false)
                  })
              // eslint-disable-next-line no-use-before-define
              handleClearClicked()
            })
      }
      else{
        console.log({formData})
        // eslint-disable-next-line no-underscore-dangle
        if (formData?._id){
          editRoom(prevKey, formData)
              .then(res => {
                allRooms(1,1000)
                    .then(response => {
                      setHotelRooms(response)
                      setLoading(false)
                    })
                // eslint-disable-next-line no-use-before-define
                handleClearClicked()
                setSaveMode('save')
              })
        }
      }
    }
  }, [uploadFinished, videoUploadFinished]);

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

  const handleVideosSelected = (e) => {
    console.log("Video: ", e.target.files)
    setVideoName(e.target.files)
  }

  const uploadImage = async () => {
    console.log('In image upload function')
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
      const imageRef = storageRef(storage, `rooms/${formData.name}-${i}`);

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

  const uploadVideo = async () => {
    const videoUrls = []
    setVideoUploadFinished(false)

    if (videoName?.length === 0){
      setVideoUploadFinished(true)
      return
    }
    // eslint-disable-next-line no-plusplus
    for (let i=0; i<videoName?.length; i++){
      if (imageName[i] === null) {
        toast.error("Please select a video ");
        setVideoUploadFinished(true)
        return;
      }
      const videoRef = storageRef(storage, `rooms/${formData?.type}/videos/room-${formData.number}-${i}`);

      uploadBytes(videoRef, videoName[i])
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
                .then((url) => {
                  console.log(url);
                  videoUrls.push(url)

                  if (i === imageName?.length - 1){
                    setFormData({
                      ...formData, images: videoUrls
                    })
                    setVideoUploadFinished(true)
                  }
                })
                .catch((error) => {
                  toast.error(error.message);
                  setVideoUploadFinished(true)
                });
          })
          .catch((error) => {
            toast.error(error.message);
            setVideoUploadFinished(true)
          });
    }
  }

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = []

    if (step === 0){
      const requiredFields = ['number', 'type']

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
    allRooms(1,1000)
        .then(res => {
          console.log('All services: ', {res})
          setHotelRooms(res)
        })
  }, []);


  const handleSaveClicked = async () => {
    setLoading(true)
    const formValid = validateForm()
    console.log({ formValid })
    console.log({ errorFields });
    if (formValid){
      setErrorFields([])

      await uploadVideo()
      await uploadImage()

      // if (saveMode === 'save'){
      //   newRoomType(formData)
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
      //     editRoomType(prevKey, formData)
      //         .then(res => {
      //           allRoomTypes(1,1000)
      //               .then(response => {
      //                 setAllTypes(response)
      //               })
      //           // eslint-disable-next-line no-use-before-define
      //           handleClearClicked()
      //           setSaveMode('save')
      //         })
      // }

    }

  }

  const handleClearClicked = () => {
    setFormData({
      name: '',
      number: '',
      type: '',
      bonusPrice: '',
      images: [],
      videos: [],
    })
  }

  const handleEditIconClicked = (row) => {
    // console.log({row})
    setFormData({
      ...formData,
      ...row,
    })
    setSaveMode('edit')
    setPrevKey(row?.number)
  }

  const handleDeleteIconClicked = (row) => {
    setPrevKey(row?.number)
    setShowDeleteAlert(true)
  }

  const deleteItem = (name) => {
    editRoom(name, { isDeleted: true, })
        .then(res => {
          allRooms(1,1000)
              .then(response => {
                // console.log("All types: ", response)
                setAllTypes(response)
                setShowDeleteAlert(false)
              })
        })
  }

  const openItemModal = (row) => {
    console.log({row})
    // setSelectedItem(row)

    // get the price of the room type
    const roomType = allTypes?.filter(el => el?.name === row?.type)
    const roomTypePrice = roomType?.price

    setSelectedItem({...row, roomTypePrice})

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
              <label htmlFor="number">Number <span className='text-danger font-weight-bold'>*</span></label>
              <input name='number' type="text" value={formData.number} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="name">Name</label>
              <input name='name' type="text" value={formData.name} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="type">Room Type <span className='text-danger font-weight-bold'>*</span></label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select name='type' value={formData.type} className="form-control" onChange={handleChange}>
                <option value="">Select a room type</option>
                {
                  allTypes?.map((type, index) => {
                    return <option key={index} value={type?.name}>{type?.name}</option>
                  })
                }
              </select>
            </Col>
          </Row>
          <Row className="mb-md-4">
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="bonusPrice">Bonus Price</label>
              <input name='bonusPrice' type="text" value={formData.bonusPrice} className="form-control" onChange={handleChange}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="images">Images </label>
              <input ref={ref} name='images' type="file" multiple accept='image/*' min={0} className="form-control" onChange={handleImagesSelected}/>
            </Col>
            <Col md={4} className='mb-4 mb-md-0'>
              <label htmlFor="videos">Videos </label>
              <input ref={ref} name='videos' type="file" multiple accept='video/*' min={0} className="form-control" onChange={handleVideosSelected}/>
            </Col>
          </Row>
          <Row className="justify-content-center mb-4 mb-md-7 g-3 mt-3">
            <Col md={2} className="align-self-center">
              <Button disabled={loading} onClick={handleSaveClicked} className="btn btn-danger w-100 rounded-2">
                {
                  // eslint-disable-next-line no-nested-ternary
                  loading? "Busy": saveMode === 'save'? "Save": "Save Changes"
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
              <GridComponent  dataSource={hotelRooms} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
                <ColumnsDirective>
                  <ColumnDirective field='number' headerText='Number' width='100'/>
                  <ColumnDirective field='name' headerText='Name' width='100'/>
                  <ColumnDirective field='type' headerText='Type' width='80'/>
                  <ColumnDirective field='bonusPrice' headerText='Bonus Price' width='70'/>
                  <ColumnDirective field='images' headerText='Images' width='100'/>
                  <ColumnDirective field='videos' headerText='Videos' width='100'/>
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
              <Modal.Title>Room {selectedItem?.number}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Number: </p>
                  <p className='font-weight-bold' style={{fontSize: 24}}>{selectedItem?.number}</p>
                </Col>
                <Col>
                  <p className='h5'>Name: </p>
                  <p className='font-weight-bold text-capitalize' style={{fontSize: 24}}>{selectedItem?.name}</p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Type: </p>
                  <p className='font-weight-bold' style={{fontSize: 24}}>{selectedItem?.type}</p>
                </Col>
                <Col>
                  <p className='h5'>Price: </p>
                  <p className='font-weight-bold' style={{fontSize: 24}}>{selectedItem?.bonusPrice ?? selectedItem?.roomTypePrice}</p>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <p className='h5'>Images: </p>
                  {
                    selectedItem?.images?.map((item, index) => {
                      return <img key={index} src={item} alt={`room image ${index}`} style={{width: 200, height: 200, marginRight: 20}} />
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

export default Rooms;
