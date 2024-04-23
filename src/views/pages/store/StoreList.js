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

const StoreList = () => {
  const title = 'Store List';
  const description = 'Store List';

  const ref = useRef();

  const [loading, setLoading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [imageName, setImageName] = useState('');
  const [saveMode, setSaveMode] = useState('save');
  const [errorFields, setErrorFields] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [prevKey, setPrevKey] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [allTypes, setAllTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bookingPrice: '',
    images: '',
  });

  useEffect(() => {
    allStores(1, 1000).then((response) => {
      console.log({ resCat: response });
      setStoreItems(response);
    });

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
    const requiredFields = ['name', 'costPrice', 'salePrice', 'quantity', 'unit', 'expiryDate', 'description'];

    // get all the keys of the booking form
    const keys = Object.keys(formData);

    if (selectedItem?.category === 'DEFAULT' || !selectedItem?.category) {
      invalidFields.push('category');
      toast.error(`The ${'category'} field is required.`);
    }

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

  //   const handleClearClicked = () => {
  //     setFormData({
  //       name: '',
  //       description: '',
  //       bookingPrice: '',
  //       images: '',
  //     });

  //     // clear the input ref
  //     ref.current.value = '';
  //   };

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
              allStores(1, 1000).then((response) => {
                setStoreItems(response);
              });
            } else {
              toast.error(res?.message);
            }

            // eslint-disable-next-line no-use-before-define
            setUploadFinished(false);
            // handleClearClicked();
          })
          .catch((e) => {
            console.log({ Err: e.response.data.message });
            toast.error(e?.response?.data?.message);
            setLoading(false);
          });
      } else {
        console.log({ formData });
        // eslint-disable-next-line no-underscore-dangle
        // if (formData?._id) {
        //   editStore(prevKey, formData).then((res) => {
        //     allStores(1, 1000).then((response) => {
        //       setStoreItems(response);
        //     });
        //     // eslint-disable-next-line no-use-before-define
        //     handleClearClicked();
        //     setSaveMode('save');
        //   });
        // }
      }
    }
  }, [uploadFinished]);

  async function handleEditAction() {
    setLoading(true);
    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });

    if (formValid) {
      setLoading(true);
      setErrorFields([]);

      editStore(selectedItem.name, formData)
        .then((response) => {
          // handleClearClicked();
          if (response.status === 'success') {
            allStores(1, 1000).then((res) => {
              //   console.log({ resCat: res });
              setStoreItems(res);
              setLoading(false);
              toast.success('Item Edited Successfully');
            });
          } else {
            toast.error(response.data);
            setLoading(false);
          }
        })
        .catch((e) => {
          toast.error('An Unexpected Error occured!');
        });
    } else {
      setLoading(false);
    }

    // handleClearClicked();
  }

  function formatDate(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date in the desired format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  const handleEditIconClicked = (row) => {
    const formattedDate = formatDate(row.expiryDate);
    console.log({ row });
    setSelectedItem(row);
    setShowEditItem(true);
    setFormData({
      //   ...formData,
      ...row,
      expiryDate: formattedDate,
    });

    // setSaveMode('edit');
    // setPrevKey(row?.number);
  };

  const handleDeleteIconClicked = (row) => {
    setPrevKey(row?.name);
    setShowDeleteAlert(true);
  };

  const deleteItem = (name) => {
    editStore(name, { isDeleted: true })
      .then((res) => {
        console.log('delRes::', res);
        if (res.status === 'success') {
          allStores(1, 1000).then((response) => {
            console.log('All types: ', response);
            setStoreItems(response);
            toast.success('Item deleted successfully');
            setShowDeleteAlert(false);
          });
        } else {
          toast.error(res.data);
        }
      })
      .catch((e) => {
        toast.error('An unexpected error occured!');
      });
  };

  const openItemModal = (row) => {
    console.log({ row });
    // setSelectedItem(row)

    setSelectedItem(row);
    console.log({ selectedItem });

    setShowItem(true);
  };

  const closeItemModal = () => {
    setShowItem(false);
  };

  const closeEditItemModal = () => {
    setShowEditItem(false);
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

      <Row>
        <Col>
          <GridComponent dataSource={storeItems} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
            <ColumnsDirective>
              <ColumnDirective field="sn" headerText="Number" width="5" />
              <ColumnDirective field="name" headerText="Name" width="100" />
              <ColumnDirective field="costPrice" headerText="Cost Price" width="40" />
              <ColumnDirective field="salePrice" headerText="Sale Price" width="40" />
              <ColumnDirective field="quantity" headerText="Qty" width="30" />
              <ColumnDirective field="unit" headerText="Unit" width="50" />
              <ColumnDirective headerText="Actions" template={ActionButtons} width="100" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter]} />
          </GridComponent>
        </Col>
      </Row>
      {showDeleteAlert && (
        <SweetAlert
          title="Delete Store Item"
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
          Are you sure you want to delete this item?
        </SweetAlert>
      )}
      <Modal show={showItem} onHide={closeItemModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Store Item {selectedItem?.sn}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <p className="h5">Number: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.sn}
              </p>
            </Col>
            <Col>
              <p className="h5">Name: </p>
              <p className="font-weight-bold text-capitalize" style={{ fontSize: 24 }}>
                {selectedItem?.name}
              </p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <p className="h5">Cost Price: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.costPrice}
              </p>
            </Col>
            <Col>
              <p className="h5">Sale Price: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.salePrice}
              </p>
            </Col>
            <Col>
              <p className="h5">Qty: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.quantity}
              </p>
            </Col>
            <Col>
              <p className="h5">Unit: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.unit}
              </p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <p className="h5">Images: </p>
              {selectedItem?.images?.map((item, index) => {
                return <img key={index} src={item} alt={`room image ${index}`} style={{ width: 200, height: 200, marginRight: 20 }} />;
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

      {/* edit modal */}
      <Modal show={showEditItem} onHide={closeEditItemModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit {selectedItem.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Row className="mb-2">
            <Col>
              <p className="h5">Number: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.sn}
              </p>
            </Col>
            <Col>
              <p className="h5">Name: </p>
              <p className="font-weight-bold text-capitalize" style={{ fontSize: 24 }}>
                {selectedItem?.name}
              </p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <p className="h5">Cost Price: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.costPrice}
              </p>
            </Col>
            <Col>
              <p className="h5">Sale Price: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.salePrice}
              </p>
            </Col>
            <Col>
              <p className="h5">Qty: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.quantity}
              </p>
            </Col>
            <Col>
              <p className="h5">Unit: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedItem?.unit}
              </p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <p className="h5">Images: </p>
              {selectedItem?.images?.map((item, index) => {
                return <img key={index} src={item} alt={`room image ${index}`} style={{ width: 200, height: 200, marginRight: 20 }} />;
              })}
            </Col>
          </Row> */}

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
                <option value="DEFAULT">Select a store category</option>
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

            {/* <Col md={8} className="mb-4 mb-md-2">
              <label htmlFor="images">
                Images <span className="text-danger font-weight-bold">*</span>
              </label>
              <input ref={ref} name="images" type="file" multiple accept="image/*" min={0} className="form-control" onChange={handleImagesSelected} />
            </Col> */}

            <Col md={12} className="mb-4 mb-md-2">
              <label htmlFor="name">
                Description <span className="text-danger font-weight-bold">*</span>
              </label>
              <textarea name="description" value={formData.description} className="form-control" cols="30" rows="5" onChange={handleChange} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="secondary" onClick={closeEditItemModal}>
            Close
          </Button>
          <Button
            disabled={loading}
            variant="primary"
            onClick={() => {
              closeEditItemModal();
              handleEditAction();
            }}
          >
            Edit Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreList;
