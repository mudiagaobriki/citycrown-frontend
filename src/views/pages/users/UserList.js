import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Card, Table, InputGroup, Form, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import 'intro.js/introjs.css';
import { useSelector } from 'react-redux';
import { ColumnDirective, ColumnsDirective, GridComponent, Page, Sort, Filter, Inject } from '@syncfusion/ej2-react-grids';
import { BsArrowLeft, BsArrowRight, BsPerson, BsCalendar, BsPhone, BsImages, BsGeoAlt, BsHouse, BsGenderAmbiguous, BsEye } from 'react-icons/bs';
import { FaFloppyDisk, FaPencil } from 'react-icons/fa6';
// import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
// import { MdCancel } from 'react-icons/md';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
// import { BiEdit } from 'react-icons/bi';
// import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';
// import { FiDelete } from 'react-icons/fi';
import { GiTrashCan } from 'react-icons/gi';
import SweetAlert from 'react-bootstrap-sweetalert';
// import { allRoomTypes } from '../../../services/roomTypeService';
import { storage } from '../../../hooks/useFirebase';
import { allUsers, editUser } from '../../../services/userService';
import { allStoreCategories } from '../../../services/storeCategoryService';

const UserList = () => {
  const title = 'Users List';
  const description = 'Users List';

  const ref = useRef();
  const loadingButtonRef = useRef(null);
  const delButtonRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [imageName, setImageName] = useState('');
  const [saveMode, setSaveMode] = useState('save');
  const [errorFields, setErrorFields] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [prevKey, setPrevKey] = useState('');
  const [selectedUser, setSelectedUser] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [allTypes, setAllTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bookingPrice: '',
    images: '',
  });

  useEffect(() => {
    allUsers(1, 1000).then((response) => {
      console.log({ resCat: response });
      setUsers(response);
    });
  }, []);

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [{ field: 'name', direction: 'Ascending' }] };

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: '/users-list', text: 'Users List' },
  ];

  const { currentUser } = useSelector((state) => state.auth);

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
    const requiredFields = ['name', 'costPrice', 'salePrice', 'quantity', 'unit', 'expiryDate', 'description'];

    // get all the keys of the booking form
    const keys = Object.keys(formData);

    // if (selectedItem?.category === 'DEFAULT' || !selectedItem?.category) {
    //   invalidFields.push('category');
    //   toast.error(`The ${'category'} field is required.`);
    // }

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

  async function handleEditAction() {
    // setLoading(true);
    loadingButtonRef.current.disabled = true;

    const formValid = validateForm();
    console.log({ formValid });
    console.log({ errorFields });

    if (formValid) {
      setLoading(true);
      setErrorFields([]);

      editUser(selectedUser.email, formData)
        .then((response) => {
          loadingButtonRef.current.disabled = false;
          // handleClearClicked();
          if (response.status === 'success') {
            allUsers(1, 1000).then((res) => {
              //   console.log({ resCat: res });
              setUsers(res);
              setLoading(false);
              toast.success('User Edited Successfully');
            });
          } else {
            loadingButtonRef.current.disabled = false;
            toast.error(response.data);
            // setLoading(false);
          }
        })
        .catch((e) => {
          loadingButtonRef.current.disabled = false;
          toast.error('An Unexpected Error occured!');
        });
    } else {
      loadingButtonRef.current.disabled = false;
      //   setLoading(false);
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
    console.log({ row });
    setSelectedUser(row);
    setShowEditItem(true);
    const rowData = { ...row };
    const profileData = rowData?.profile || {};
    rowData.profile = null;
    setFormData({
      //   ...formData,
      ...rowData,
      ...profileData,
    });

    // setSaveMode('edit');
    // setPrevKey(row?.number);
  };

  const handleDeleteIconClicked = (row) => {
    setPrevKey(row?.email);
    setShowDeleteAlert(true);
  };

  const deleteUser = (email) => {
    console.log({ email });
    // delButtonRef.current.disabled = true;
    editUser(email, { isDeleted: true })
      .then((res) => {
        setShowDeleteAlert(false);
        console.log({ res });
        // delButtonRef.current.disabled = false;
        console.log('delRes::', res);
        if (res.status === 'success') {
          allUsers(1, 1000).then((response) => {
            console.log('All types: ', response);
            setUsers(response);
            toast.success('User deleted successfully');
          });
        } else {
          //   delButtonRef.current.disabled = false;
          toast.error(res.data);
          setShowDeleteAlert(false);
        }
      })
      .catch((e) => {
        setShowDeleteAlert(false);
        console.log({ e });
        // delButtonRef.current.disabled = false;
        toast.error('An unexpected error occured!');
      });
  };

  const openItemModal = (row) => {
    console.log({ row });
    // setSelectedItem(row)

    setSelectedUser(row);
    console.log({ selectedUser });

    setShowUser(true);
  };

  const closeItemModal = () => {
    setShowUser(false);
  };

  const closeEditItemModal = () => {
    setShowEditItem(false);
  };

  const ActionButtons = (props) => {
    // console.log({ props });
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

  const userVerificationStatusPills = (props) => {
    if (props?.verified) {
      return <span className="badge rounded-pill bg-success">Verified</span>;
    }
    return <span className="badge rounded-pill bg-danger">Unverified</span>;
  };

  function formatDateToReadableDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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

      <Row>
        <Col>
          <GridComponent dataSource={users} allowPaging pageSettings={pageSettings} allowSorting sortSettings={sortSettings}>
            <ColumnsDirective>
              <ColumnDirective field="sn" headerText="S/N" width="15" />
              {/* <ColumnDirective field="name" headerText="Name" width="50" /> */}
              <ColumnDirective field="email" headerText="Email" width="50" />
              <ColumnDirective field="type" headerText="Type" width="40" />
              <ColumnDirective field="status" headerText="Status" width="40" />
              <ColumnDirective template={userVerificationStatusPills} headerText="Email Verified" width="40" />
              <ColumnDirective headerText="Actions" template={ActionButtons} width="100" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter]} />
          </GridComponent>
        </Col>
      </Row>
      {showDeleteAlert && (
        <SweetAlert
          title="Delete User"
          info
          showCancel
          confirmBtnBsStyle="warning"
          confirmBtnText="Delete"
          // cancelBtnBsStyle="danger"
          onConfirm={() => {
            deleteUser(prevKey);
          }}
          onCancel={() => {
            setShowDeleteAlert(false);
          }}
        >
          Are you sure you want to delete this user?
        </SweetAlert>
      )}
      <Modal show={showUser} onHide={closeItemModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User {selectedUser?.sn}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            {/* <Col>
              <p className="h5">Number: </p>
              <p className="font-weight-bold" style={{ fontSize: 24 }}>
                {selectedUser?.sn}
              </p>
            </Col> */}
            {/* <Col md={4}>
              <p className="h5">Name: </p>
              <p className="font-weight-bold text-capitalize" style={{ fontSize: 24 }}>
                {selectedUser?.name}
              </p>
            </Col> */}
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <p className="h5">First Name: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {`${selectedUser?.profile?.firstName}`}
              </p>
            </Col>

            <Col md={6}>
              <p className="h5">Last Name: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {`${selectedUser?.profile?.lastName}`}
              </p>
            </Col>

            <Col md={6}>
              <p className="h5">Email: </p>
              <p className="font-weight-bold border-bottom" style={{ fontSize: 16 }}>
                {selectedUser?.email}
              </p>
            </Col>
            <Col md={3}>
              <p className="h5">Type: </p>
              <p className="font-weight-bold border-bottom" style={{ fontSize: 16 }}>
                {selectedUser?.type}
              </p>
            </Col>
            <Col md={3}>
              <p className="h5">Status: </p>
              <p className="font-weight-bold border-bottom" style={{ fontSize: 16 }}>
                {selectedUser?.status}
              </p>
            </Col>
            <Col md={3}>
              <p className="h5">Email Verified: </p>
              <p className="font-weight-bold border-bottom" style={{ fontSize: 16 }}>
                {selectedUser?.verified ? 'Verified' : 'Unverified'}
              </p>
            </Col>

            <Col md={3}>
              <p className="h5">Country: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {`${selectedUser?.profile?.country}`}
              </p>
            </Col>

            <Col md={3}>
              <p className="h5">Gender: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {`${selectedUser?.profile?.gender}`}
              </p>
            </Col>

            <Col md={3}>
              <p className="h5">Phone Number: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {selectedUser?.profile?.phone}
              </p>
            </Col>

            <Col md={6}>
              <p className="h5">City: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {selectedUser?.profile?.city}
              </p>
            </Col>

            <Col md={2}>
              <p className="h5">Zip: </p>
              <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                {selectedUser?.profile?.zip}
              </p>
            </Col>

            {selectedUser?.profile?.maritalStatus && (
              <Col md={3}>
                <p className="h5">Marital Status: </p>
                <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                  {selectedUser?.profile?.maritalStatus}
                </p>
              </Col>
            )}

            {selectedUser?.profile?.maritalStatus?.toLowerCase() === 'married' && (
              <Col md={3}>
                <p className="h5">Marriage Anniversary: </p>
                <p className="font-weight-bold border-bottom text-capitalize" style={{ fontSize: 16 }}>
                  {selectedUser?.profile?.marriageAnniversary}
                </p>
              </Col>
            )}
          </Row>
          {/* <Row className="mb-2">
            <Col>
              <p className="h5">Images: </p>
              {selectedItem?.images?.map((item, index) => {
                return <img key={index} src={item} alt={`room image ${index}`} style={{ width: 200, height: 200, marginRight: 20 }} />;
              })}
            </Col>
          </Row> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeItemModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              closeItemModal();
              handleEditIconClicked(selectedUser);
            }}
          >
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* edit modal */}
      <Modal show={showEditItem} onHide={closeEditItemModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit {selectedUser?.profile?.firstName ? selectedUser?.profile?.firstName : selectedUser?.email}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-md-4">
            {formData?.firstName && (
              <Col md={4} className="mb-4 mb-md-2">
                <label htmlFor="name">
                  First Name <span className="text-danger font-weight-bold">*</span>
                </label>
                <input name="name" type="text" value={formData?.firstName} className="form-control" onChange={handleChange} />
              </Col>
            )}

            {formData?.lastName && (
              <Col md={4} className="mb-4 mb-md-2">
                <label htmlFor="name">
                  Last Name <span className="text-danger font-weight-bold">*</span>
                </label>
                <input name="name" type="text" value={formData?.lastName} className="form-control" onChange={handleChange} />
              </Col>
            )}

            <Col md={4} className="mb-4 mb-md-2">
              <label htmlFor="type">
                Type <span className="text-danger font-weight-bold">*</span>
              </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select name="type" value={formData?.type} className="form-control" onChange={handleChange}>
                <option value={formData?.type}>{formData?.type}</option>
                {formData?.type?.toLowerCase() === 'customer' ? <option value="Admin">Admin</option> : <option value="Customer">Customer</option>}
              </select>
            </Col>

            <Col md={4} className="mb-4 mb-md-2">
              <label htmlFor="status">
                Status <span className="text-danger font-weight-bold">*</span>
              </label>
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
              <select name="status" value={formData?.status} className="form-control" onChange={handleChange}>
                <option value={formData?.status}>{formData?.status}</option>
                {formData?.status?.toLowerCase() === 'active' ? <option value="Inactive">In Active</option> : <option value="IActive">Active</option>}
              </select>
            </Col>

            {formData?.country && (
              <Col md={4} className="mb-4 mb-md-2">
                <label htmlFor="country">
                  Country <span className="text-danger font-weight-bold">*</span>
                </label>
                <input name="country" type="text" value={formData?.country} className="form-control" onChange={handleChange} />
              </Col>
            )}

            {formData?.gender && (
              <Col md={4} className="mb-4 mb-md-2">
                <label htmlFor="gender">
                  Gender <span className="text-danger font-weight-bold">*</span>
                </label>
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select name="gender" value={formData?.gender} className="form-control" onChange={handleChange}>
                  <option value={formData?.gender}>{formData?.gender}</option>
                  {formData?.gender?.toLowerCase() === 'female' ? <option value="Male">Male</option> : <option value="Female">Female</option>}
                </select>
              </Col>
            )}

            {formData?.phone && (
              <Col md={4} className="mb-4 mb-md-2">
                <label htmlFor="phone">
                  Phone Number <span className="text-danger font-weight-bold">*</span>
                </label>
                <input name="phone" type="text" value={formData?.phone} className="form-control" onChange={handleChange} />
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="secondary" onClick={closeEditItemModal}>
            Close
          </Button>
          <Button
            // disabled={loading}
            ref={loadingButtonRef}
            variant="primary"
            onClick={() => {
              //   closeEditItemModal();
              handleEditAction();
            }}
          >
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserList;
