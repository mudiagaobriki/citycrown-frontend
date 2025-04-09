import React, {useState} from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import {toast, ToastContainer} from "react-toastify";
import {useDispatch} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {setCurrentUser} from "../../auth/authSlice";
import ziofy from "../../assets/ziofy.png"
import {API_URL} from "../../assets/constants";

const Login = () => {
  const title = 'Login';
  const description = 'Login Page';
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)
  const [onUpgrade, setOnUpgrade] = useState(false)
  const [showVerificationAlert, setShowVerificationAlert] = useState(false)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });
  const initialValues = { email: '', password: '' };
  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      // // console.log("Result:", result);


      if (result.loginToken){
        if (result.onUpgrade?.toString()?.toLowerCase() === "upgrade"){
          setOnUpgrade(true);
          setLoading(false)
          return;
        }

        // if (!result.verified){
        //   setShowVerificationAlert(true);
        //   setLoading(false)
        //   return;
        // }

        setLoading(false)
        dispatch(setCurrentUser(result))
        localStorage.setItem("currentUser", JSON.stringify(result));
        history.push("/checkin")
      }
      else{
        toast.error(result.toString());
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false)
      toast.error(error.toString());
    }
  }

  const resendVerificationEmail = async (values) => {
    // // console.log({values})
    try {
      const response = await fetch(`${API_URL}/users/auth/email/verify/resend`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      // console.log("Result:", result);


      if (result.status === "success"){
        setShowVerificationAlert(false)
        toast.success("Verification email sent successfully")
      }
      else{
        toast.error("Verification email not sent successfully");
        setShowVerificationAlert(false)
      }
    } catch (error) {
      console.error("Error:", error);
      setShowVerificationAlert(false)
      toast.error("Verification email not sent successfully");
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
            <h1 className="display-3 text-white">Relaxation and Comfort</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            {"  "}
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
    <div className="sw-lg-70 rounded-2 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11 mb-2 text-center">
          <NavLink to="/">
            <img src={ziofy} style={{width: 150, height: "auto",}} alt="Logo"/>
          </NavLink>
        </div>
        <div className="mb-5 text-center">
          <h2 className="cta-1 mb-0 text-primary">User Login</h2>
        </div>
        <div className="mb-5 text-center">
          <p className="h6">Please use your credentials to login.</p>
        </div>
        <div>
          <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              <NavLink className="text-small position-absolute t-3 e-3" to="/forgot-password">
                Forgot?
              </NavLink>
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <ToastContainer />
            <Button disabled={loading} className="w-100 rounded-2" size="lg" type="submit">
              {
                loading? "Loading...": "Login"
              }
            </Button>
            {/* <p className="h6 mt-5 text-center"> */}
            {/*  Don't have an account? <NavLink to="/register"> */}
            {/*  <span style={{textDecorationLine: 'underline', fontWeight: 700}}>register</span>* /}
            {/* </NavLink>. */}
            {/* </p> */}
          </form>
          {onUpgrade ? (
              <SweetAlert
                  title="Account undergoing Upgrade"
                  info
                  // showCancel
                  confirmBtnBsStyle="success"
                  // cancelBtnBsStyle="danger"
                  onConfirm={() => {
                    setOnUpgrade(false)
                    window.location.reload();
                  }}
                  // onCancel={() => {
                  //     setSuccessMsg(false)
                  // }}
              >
                Please contact customer support or account officer via chat or the site admin
              </SweetAlert>
          ) : null}
          {showVerificationAlert ? (
              <SweetAlert
                  title="Account not verified"
                  info
                  // showCancel
                  confirmBtnBsStyle="success"
                  confirmBtnText="Resend verification email"
                  // cancelBtnBsStyle="danger"
                  onConfirm={() => {
                    resendVerificationEmail(values)
                  }}
                  // onCancel={() => {
                  //     setSuccessMsg(false)
                  // }}
              >
                Please check your email and verify your account
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

export default Login;
