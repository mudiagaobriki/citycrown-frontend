import React, { useState } from 'react';
import { Button, Row, Col, Card, Nav, Form, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { LAYOUT } from 'constants.js';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import useCustomLayout from 'hooks/useCustomLayout';
import 'react-datepicker/dist/react-datepicker.css';
import { useWindowSize } from 'hooks/useWindowSize';
import {toast} from "react-toastify";

const NavContent = () => {
  return (
    <Nav className="flex-column">
      <div className="mb-2">
        <Nav.Link className="px-0 active">
          <CsLineIcons icon="activity" className="me-2 sw-3" size="17" />
          <span className="align-middle">Profile</span>
        </Nav.Link>
        <div>
          <Nav.Link className="px-0 pt-1 active">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Personal</span>
          </Nav.Link>
        </div>
      </div>
    </Nav>
  );
};

const ProfileSettings = () => {
  const title = 'Profile';
  const description = 'Profile Settings';

  const breadcrumbs = [
    { to: '', text: 'City Crown Hotels' },
  ];
  useCustomLayout({ layout: LAYOUT.Boxed });
  const { width } = useWindowSize();

  const { themeValues } = useSelector((state) => state.settings);
  const lgBreakpoint = parseInt(themeValues.lg.replace('px', ''), 10);

  const genderOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
    { value: 'Other', label: 'Other' },
    { value: 'None', label: 'None' },
  ];

  const oldUser = JSON.parse(localStorage?.getItem("currentUser"))

  const [startDate, setStartDate] = useState(new Date());
  const [gender, setGender] = useState(genderOptions.find(el => el?.value === oldUser?.gender));
  const [firstName, setFirstName] = useState(oldUser?.firstName);
  const [lastName, setLastName] = useState(oldUser?.lastName);
  const [phone, setPhone] = useState(oldUser?.phone);
  const [email, setEmail] = useState(oldUser?.email);
  const [country, setCountry] = useState(oldUser?.country);
  const [address, setAddress] = useState(oldUser?.address);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [dob, setDob] = useState("");

  const handleUpdateBasicInfo = async () => {
    const payload = {
      firstName,
      lastName,
      country,
      gender: gender?.value,
      address,
      dob,
    }

    // console.log({payload})
    try {
      const response = await fetch("https://indabosky.stock-standard.com/api/edit-user", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, payload
        }),
      });

      const result = await response.json();
      console.log("Result:", result);
      toast.success("Your profile has been updated successfully. Login again to continue.")
      setTimeout(() => {window.location.href="/login"}, 3000)
      // window.location.reload()

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.toString());
    }
  }

  const handleUpdateContactInfo = async () => {
    const payload = { phone }

    console.log({payload})

    try {
      const response = await fetch("https://indabosky.stock-standard.com/api/edit-user", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, payload
        }),
      });

      const result = await response.json();
      console.log("Result:", result);
      toast.success("Your profile has been updated successfully. Login again to continue.")
      setTimeout(() => {window.location.href="/login"}, 3000)
      // window.location.reload()

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.toString());
    }
  }

  const handleUpdatePassword = async () => {
    const payload = { email, password }

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match")
      return
    }

    try {
      const response = await fetch("https://indabosky.stock-standard.com/api/email/password-reset", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Result:", result);
      toast.success("Your password has been updated successfully. Login again to continue.")
      setTimeout(() => {
        localStorage.removeItem("currentUser")
        window.location.href="/login"
      }, 3000)
      // window.location.reload()

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.toString());
    }
  }

  return (
    <>
      <HtmlHead title={title} description={description} />

      <Row>
        {width && width >= lgBreakpoint && (
          <Col xs="auto" className="d-none d-lg-flex">
            <div className="nav flex-column sw-25 mt-n2">
              <NavContent />
            </div>
          </Col>
        )}

        <Col>
          {/* Title and Top Buttons Start */}
          <div className="page-title-container">
            <Row>
              {/* Title Start */}
              <Col>
                <h1 className="mb-0 pb-0 display-4">{title}</h1>
                <BreadcrumbList items={breadcrumbs} />
              </Col>
              {/* Title End */}

              {/* Top Buttons Start */}
              {width && width < lgBreakpoint && (
                <Col xs="12" sm="auto" className="d-flex align-items-start justify-content-end d-block d-lg-none">
                  <Dropdown align="end">
                    <Dropdown.Toggle as={Button} variant="outline-primary" className="btn-icon btn-icon-start btn-icon w-100 w-sm-auto">
                      <CsLineIcons icon="gear" /> <span>Settings </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="sw-25 py-3 px-4">
                      <NavContent />
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              )}

              {/* Top Buttons End */}
            </Row>
          </div>
          {/* Title and Top Buttons End */}

          {/* Public Info Start */}
          <h2 className="small-title">Basic Info</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">First Name</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control onChange={(e) => setFirstName(e.target.value)} type="text" defaultValue={firstName} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Last Name</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control onChange={(e) => setLastName(e.target.value)} type="text" defaultValue={lastName} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Country</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="text" defaultValue={country} onChange={(e) => setCountry(e.target.value)}  />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Date of Birth</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <DatePicker className="form-control" selected={dob} onChange={(date) => setDob(date)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Gender</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Select classNamePrefix="react-select" options={genderOptions} defaultValue={gender} onChange={setGender} placeholder="" />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Address</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control as="textarea" rows={3} defaultValue={address} onChange={(e) => setAddress(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Email</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" defaultValue={email} disabled />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg="2" md="3" sm="4" />
                  <Col sm="8" md="9" lg="10">
                    <Button onClick={handleUpdateBasicInfo} variant="outline-primary" className="mb-1">
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          {/* Public Info End */}

          {/* Contact Start */}
          <h2 className="small-title">Contact</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Primary Email</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" defaultValue={email} disabled />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Primary Phone Number</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" defaultValue={phone} onChange={(e) => setPhone(e.target.value)}  />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg="2" md="3" sm="4" />
                  <Col sm="8" md="9" lg="10">
                    <Button onClick={handleUpdateContactInfo} variant="outline-primary" className="mb-1">
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          {/* Contact End */}

          {/* Jobs Start */}
          <h2 className="small-title">Update Password</h2>
          <Card className="mb-5">
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">New Password</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Retype Password</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" defaultValue={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}  />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg="2" md="3" sm="4" />
                  <Col sm="8" md="9" lg="10">
                    <Button onClick={handleUpdatePassword} variant="outline-primary" className="mb-1">
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          {/* Jobs End */}
        </Col>
      </Row>
    </>
  );
};

export default ProfileSettings;
