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
import {BiEdit, BiSend} from "react-icons/bi";
import {AiFillDelete, AiOutlineDelete} from "react-icons/ai";
import {FiDelete} from "react-icons/fi";
import {GiTrashCan} from "react-icons/gi";
import SweetAlert from "react-bootstrap-sweetalert";
import {useHistory} from "react-router-dom";
import { allRoomTypes } from "../../../services/roomTypeService";
import {storage} from '../../../hooks/useFirebase'
import {allAmenities, editAmenity, newAmenity} from "../../../services/amenityService";
import {newMessage} from "../../../services/messageService";
import {allProfiles} from "../../../services/profileService";
import {getObjectsWithDate} from "../../../assets/functions";

const TextMessaging = () => {
  const title = 'Text Messaging';
  const description = 'Text Messaging';
  const history = useHistory()
  const phone = history.location?.state?.data;
  const cusEmail = history.location?.state?.emailData;
  console.log("state:",history.location?.state);
  console.log({cusEmail})

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [imageName, setImageName] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [birthdayList, setBirthdayList] = useState([]);
  const [anniversaryList, setAnniversaryList] = useState([]);
  const [images, setImages] = useState(null);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [saveMode, setSaveMode] = useState('save');
  const [prevKey, setPrevKey] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState('default');

  const [formData, setFormData] = useState({
    type: 'sms',
    from: 'City Crown Hotels',
    recipients: '',
    body: '',
    subject: "",
  });

  const pageSettings = { pageSize: 20 };
  const sortSettings = { columns: [
      { field: 'name', direction: 'Ascending' }
    ] };


  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Text Messaging' },
  ];

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });
  const ref = useRef()

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  useEffect(() => {
    if (phone !== "" && phone !== undefined){
      setFormData({
        ...formData,
        recipients: phone,
      })
    }
  }, [phone]);

  // Get birthday and anniversary list
  useEffect(() => {
    allProfiles(1,1000)
        .then((res)=>{
          setProfiles(res)
          let bList = getObjectsWithDate(res,'dateOfBirth')
          bList = bList.map(el=>{
            return el?.phone
          })

          let anList = getObjectsWithDate(res,'marriageAnniversary')
          anList = anList.map(el=>{
            return el?.phone
          })

          console.log({bList})
          console.log({anList})
          setBirthdayList(bList)
          setAnniversaryList(anList)
        })
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'type' && value === 'email' && cusEmail !== '' && cusEmail !== undefined){
      setFormData({
        ...formData,
        recipients: cusEmail,
      })
    }
  };

  const handleMessageBodyChange =(e) => {
    setFormData({
      ...formData,
      body: e?.target?.value
    })
  }

  const validateForm = () => {
    // check which fields are invalid
    const invalidFields = []

    if (step === 0){
      const requiredFields = ['type', 'from', 'to', 'body']

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

  const handleClearClicked = () => {
    setFormData({
      type: 'sms',
      from: 'City Crown Hotels',
      to: '',
      recipients: '',
      body: '',
      subject: "",
    })
  }

  const handleSaveClicked = async () => {
    setLoading(true)
    const formValid = validateForm()
    console.log({ formValid })
    console.log({ errorFields });
    if (formValid){
      setErrorFields([])
      // make the recipients an array before sending
      console.log({formData})
      const recipients = formData?.recipients
      console.log({recipients})
      // setFormData({
      //   ...formData,
      //   recipients: recipients?.split(",")
      // })
      // console.log({formData})

      // submit form data here
      newMessage(formData)
          .then(res => {
            console.log({res})
            handleClearClicked()
            window.location.reload()
          })
          .catch(err => {
            console.log({err})
            handleClearClicked()
          })
    }

    setLoading(false)
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
            <p>(Automated messaging coming soon)</p>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          {/* Top Buttons End */}
        </Row>
      </div>
      {/* Title and Top Buttons End */}
      { step === 0 && <>
        <Row className="mb-md-4">
          <Col md={6} className='mb-4 mb-md-0'>
            <div key='d-flex' className="mb-3">
              <Form.Check
                  inline
                  label="Default"
                  name="preset"
                  type='radio'
                  id='default'
                  checked={preset==='default'}
                  onClick={()=>setPreset('default')}
              />
              <Form.Check
                  inline
                  label="Birthday Today"
                  name="preset"
                  type='radio'
                  id='birthday-today'
                  checked={preset==='birthday-today'}
                  onClick={()=>{
                    setFormData({
                      ...formData,
                      recipients: birthdayList
                    })
                    setPreset('birthday-today')
                  }}
              />
              <Form.Check
                  inline
                  label="Anniversary Today"
                  name="preset"
                  type='radio'
                  id='anniversary-today'
                  checked={preset==='anniversary-today'}
                  onClick={()=>{
                    setFormData({
                      ...formData,
                      recipients: anniversaryList
                    })
                    setPreset('anniversary-today')
                  }}
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-md-4">
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="type">Message Type <span className='text-danger font-weight-bold'>*</span></label>
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select name='type' type="text" value={formData.type} className="form-control" onChange={handleChange}>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="from">Sender <span className='text-danger font-weight-bold'>*</span></label>
            <input name='from' type="text" value={formData.from} className="form-control" onChange={handleChange}/>
          </Col>
          <Col md={4} className='mb-4 mb-md-0'>
            <label htmlFor="subject">Subject/Title </label>
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <input name='subject' disabled={formData?.type==='sms'} type="text" value={formData.subject} className="form-control" onChange={handleChange}/>
          </Col>
        </Row>
        <Row className="mb-md-4">
          <Col md={12} className='mb-4 mb-md-0'>
            <label htmlFor="recipients">Recipients (Separate with comma) <span className='text-danger font-weight-bold'>*</span></label>
            <input name='recipients' type="text" value={formData.recipients} className="form-control" onChange={handleChange}/>
          </Col>
        </Row>
        <Row className="mb-md-4">
          <Col md={12} className='mb-4 mb-md-0'>
            <label htmlFor="body">Message Content <span className='text-danger font-weight-bold'>*</span> </label>
            <textarea name="body" cols="30" rows="15" defaultValue={formData.body} className="form-control" onChange={handleMessageBodyChange} />
          </Col>
        </Row>
        <Row className="justify-content-center mb-4 mb-md-7">
          <Col md={3} className="align-self-center">
            <Button disabled={loading} onClick={handleSaveClicked} style={{height:45}} className="btn-primary btn-large w-100 rounded-2">
              {
                // eslint-disable-next-line no-nested-ternary
                loading? "Sending..." : saveMode === 'save'? "Send Message": "Save Changes"
              } <BiSend />
            </Button>
          </Col>
          <Col md={3} className="align-self-center">
            <Button onClick={handleClearClicked} style={{height:45}} className="btn-warning btn-large w-100 rounded-2">
              {
                saveMode === 'save'? "Clear": "Cancel"
              } <MdCancel />
            </Button>
          </Col>
        </Row>
      </>}

    </>
  );
};

export default TextMessaging;
