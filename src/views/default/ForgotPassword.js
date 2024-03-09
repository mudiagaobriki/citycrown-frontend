import React, {useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import {toast, ToastContainer} from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
import ziofy from "../../assets/ziofy.png";

const ForgotPassword = () => {
  const title = 'Forgot Password';
  const description = 'Forgot Password Page';
  const history = useHistory();

  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
  });
  const initialValues = { email: '' };
  // const onSubmit = (values) => console.log('submit form', values);

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await fetch("https://indabosky.stock-standard.com/api/email/forgotpassword", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // const result = await response.json();
      // console.log("Result:", response);

      toast.success("Password reset email sent successfully")
      setLoading(false)
      setTimeout(() => setEmailSent(true), 2000)

    } catch (error) {
      console.error("Error:", error);
      setLoading(false)
      toast.error("Password reset email not sent successfully: ", error?.message);
    }
  }

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">City Crown Hotels</h1>
            <h1 className="display-3 text-white">Your Trading Partner</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Helping you build an investment plan and an optimal asset allocation strategy to meet your unique needs...
          </p>
          <div className="mb-5">
            <Button size="lg" variant="outline-white" href="/">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11 mb-2 text-center">
          <NavLink to="/">
            <img src={ziofy} style={{width: 150, height: "auto"}} alt="Logo"/>
          </NavLink>
        </div>
        <div className="mb-5 text-center">
          <h2 className="cta-1 mb-0 text-primary">Password gone?</h2>
          <h2 className="cta-1 text-primary">Let's reset it!</h2>
        </div>
        <div className="mb-5 text-center">
          <p className="h6">Please enter your email to receive a link to reset your password.</p>
        </div>
        <div>
          <form id="forgotPasswordForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <Button disabled={loading} className="w-100 rounded-2" size="lg" type="submit">
              {
                loading? "Sending email...": "Send Reset Email"
              }
            </Button>
            <p className="h6 mt-5 text-center">
              If you are a member, please <NavLink to="/login">login</NavLink>.
            </p>
          </form>
          <ToastContainer />
          {emailSent ? (
              <SweetAlert
                  title="Password reset email has been sent to your mailbox"
                  info
                  // showCancel
                  confirmBtnBsStyle="success"
                  // cancelBtnBsStyle="danger"
                  onConfirm={() => {
                    setEmailSent(false)
                    window.location.href="/login";
                  }}
                  // onCancel={() => {
                  //     setSuccessMsg(false)
                  // }}
              >
                Please follow the instructions in the email to reset your password
              </SweetAlert>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default ForgotPassword;
