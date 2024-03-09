import React, { useEffect, useReducer, useRef, useState } from 'react';
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
import { FaTrash } from 'react-icons/fa';
import { allRoomTypes } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allAmenities, editAmenity, newAmenity } from '../../../services/amenityService';

const Requisition = () => {
  const title = 'Requisition';
  const description = 'Requisition';

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [amenities, setAmenities] = useState([]);
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
    description: '',
    category: '',
    images: '',
  });

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [{ field: 'name', direction: 'Ascending' }] };

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Requisition' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });
  const ref = useRef();
  const reducer = (state, action) => {
    switch (action.type) {
      case 'add': // adds to the last element of the array
        return [
          ...state,
          {
            item: '',
            unit: '',
            quantity: 1,
          },
        ];
      case 'remove':
        return state.slice(0, -1); // removes the last element of the array
      case 'removeAtIndex':
        console.log([...state.slice(0, action.index), ...state.slice(action.index + 1)]);
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)];
        // return state.filter((_, index) => index !== action.index);
      case 'addAtIndex':
        return [
          ...state.slice(0, action.index + 1),
          {
            item: '',
            unit: '',
            quantity: 1,
          },
          ...state.slice(action.index + 1),
        ];
      case 'insertAtIndex':
        return [
          ...state.slice(0, action.index),
          {
            ...{
              item: state[action.index].item,
              unit: state[action.index].unit,
              quantity: state[action.index].quantity,
            },
            [action.key]: action.value,
          },
          ...state.slice(action.index + 1),
        ];
      default:
        return state;
    }
  };

  const [items, setItems] = useReducer(reducer, [
    {
      item: '',
      unit: '',
      quantity: 1,
    },
  ]);

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
    // console.log({formData})
    if (uploadFinished && formData?.name !== '') {
      if (saveMode === 'save') {
        newAmenity(formData).then((res) => {
          allAmenities(1, 1000).then((response) => {
            setAmenities(response);
          });
          // eslint-disable-next-line no-use-before-define
          handleClearClicked();
        });
      } else {
        console.log({ formData });
        // eslint-disable-next-line no-underscore-dangle
        if (formData?._id) {
          editAmenity(prevKey, formData).then((res) => {
            allAmenities(1, 1000).then((response) => {
              setAmenities(response);
            });
            // eslint-disable-next-line no-use-before-define
            handleClearClicked();
            setSaveMode('save');
          });
        }
      }
    }
  }, [uploadFinished]);

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    setItems({
      type: 'insertAtIndex',
      key: name,
      value,
      index: i,
    })
    // setFormData({
    //   ...formData,
    //   [name]: value,
    // });
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
      const imageRef = storageRef(storage, `amenities/${formData.name}-${i}`);

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
      const requiredFields = ['item', 'quantity', 'unit'];

      // get all the keys of the booking form
      const keys = Object.keys(items[0]);
      console.log({keys})

      // loop through all the items
      // eslint-disable-next-line no-plusplus
      for (let i=0; i<items?.length; i++){
        // eslint-disable-next-line no-plusplus
        // for (let k=0; k<keys.length; k++){
        //   console.log(`${keys[k]}: ${items[i][k]}`)
        //   if (items[i][k] === '' && requiredFields?.includes(keys[k])){
        //     invalidFields.push({index: i, k})
        //     toast.error(`Please  provide a value for ${k} at position ${i + 1}`);
        //   }
        // }
        keys.forEach((key, index) => {
          console.log(`${key} at position ${i}: ${items[i][key]}`)
          if (items[i][key] === '' && requiredFields?.includes(key)){
            invalidFields.push({ index: i, key})
            toast.error(`Please  provide a value for ${key === 'item'? 'item name': key} at position ${i + 1}`);
          }
        })
      }

      // loop through and get invalid fields
      // eslint-disable-next-line no-plusplus
      // for (let i = 0; i < keys.length; i++) {
      //   const key = keys[i];
      //   if (formData[key] === '' && requiredFields?.includes(key)) {
      //     invalidFields.push(key);
      //     toast.error(`The ${key} field is required.`);
      //   }
      // }

      console.log({ invalidFields });
      if (invalidFields?.length)
        setErrorFields((prevState) => Array.from(new Set([...errorFields, ...invalidFields])));
    }

    return invalidFields.length === 0;
  };

  // fetch all room types
  useEffect(() => {
    allAmenities(1, 1000).then((res) => {
      console.log({ res });
      setAmenities(res);
    });
  }, []);

  const handleSaveClicked = async () => {
    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });
    if (formValid) {
      setErrorFields([]);
      console.log({items})
    }
  };

  const handleClearClicked = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
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
    editAmenity(name, { isDeleted: true }).then((res) => {
      allAmenities(1, 1000).then((response) => {
        setAmenities(response);
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

  useEffect(() => {
    console.log({items})
  }, [items]);

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
          <Row className="mb-4">
            <Col className="d-flex justify-content-end">
              <button
                onClick={() => setItems({ type: 'add' })}
                type="button"
                className="btn btn-success me-2"
                style={{ fontSize: 24, borderRadius: '50%', height: 40, width: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                +
              </button>
              <button
                onClick={() => setItems({ type: 'remove' })}
                disabled={items?.length === 1}
                type="button"
                className="btn btn-warning"
                style={{ fontSize: 24, borderRadius: '50%', height: 40, width: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                -
              </button>
            </Col>
          </Row>
          {items.map((item, index) => {
            return (
              <>
                <Row className="mb-md-4">
                  <Col md={3} className="mb-4 mb-md-0">
                    <label htmlFor="name">
                      Item Name <span className="text-danger font-weight-bold">*</span>
                    </label>
                    <input name="item" type="text" value={item?.item} className="form-control" onChange={(e) => handleChange(e, index)} />
                  </Col>
                  <Col md={3} className="mb-4 mb-md-0">
                    <label htmlFor="description">
                      Quantity <span className="text-danger font-weight-bold">*</span>
                    </label>
                    <input min={1} name="quantity" type="number" value={item?.quantity} className="form-control" onChange={(e) => handleChange(e, index)} />
                  </Col>
                  <Col md={3} className="mb-4 mb-md-0">
                    <label htmlFor="category">Unit </label>
                    {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                    <select name="unit" value={item?.unit} className="form-control" onChange={(e) => handleChange(e, index)}>
                      <option value="">Select a unit</option>
                      <option value="general">General</option>
                    </select>
                  </Col>
                  <Col md={3} className="d-flex justify-content-end align-items-baseline">
                    <button
                      onClick={() => setItems({ type: 'removeAtIndex', index })}
                      className="btn btn-light"
                      type="button"
                      style={{ borderRadius: '50%', height: 50, width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto' }}
                    >
                      <FaTrash />
                    </button>
                  </Col>
                </Row>
              </>
            );
          })}
          <Row className="justify-content-center mb-4 mb-md-7">
            <Col md={3} className="align-self-center">
              <Button onClick={handleSaveClicked} style={{ height: 45 }} className="btn-danger btn-large w-100 rounded-2">
                {saveMode === 'save' ? 'Save' : 'Save Changes'} <FaFloppyDisk />
              </Button>
            </Col>
            <Col md={3} className="align-self-center">
              <Button onClick={handleClearClicked} style={{ height: 45 }} className="btn-secondary btn-large w-100 rounded-2">
                {saveMode === 'save' ? 'Clear' : 'Cancel'} <MdCancel />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <GridComponent dataSource={amenities} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
                <ColumnsDirective>
                  <ColumnDirective field="name" headerText="Name" width="100" />
                  <ColumnDirective field="description" headerText="Description" width="100" />
                  <ColumnDirective field="category" headerText="Category" width="100" />
                  <ColumnDirective field="images" headerText="Images" width="100" />
                  <ColumnDirective headerText="Actions" template={ActionButtons} width="100" />
                </ColumnsDirective>
                <Inject services={[Page, Sort, Filter]} />
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
                deleteItem(prevKey);
              }}
              onCancel={() => {
                setShowDeleteAlert(false);
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
                  <p className="h5">Name: </p>
                  <p className="font-weight-bold" style={{ fontSize: 24 }}>
                    {selectedItem?.name}
                  </p>
                </Col>
                <Col>
                  <p className="h5">Category: </p>
                  <p className="font-weight-bold text-capitalize" style={{ fontSize: 24 }}>
                    {selectedItem?.category}
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
                    return <img key={index} src={item} alt={`amenity image ${index}`} style={{ width: 200, height: 200 }} />;
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

export default Requisition;
