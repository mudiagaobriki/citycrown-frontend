import React, {useEffect, useState} from 'react';
import {NavLink, useHistory, useParams} from 'react-router-dom';
import {Button, Form, Spinner} from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import {toast, ToastContainer} from "react-toastify";
import {useDispatch} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {setCurrentUser} from "../../auth/authSlice";
import ziofy from "../../assets/ziofy.png";

const VerifyEmail = () => {
  const title = 'Login';
  const description = 'Login Page';
  const history = useHistory();
  const dispatch = useDispatch();
  const { code } = useParams()

  console.log({code})

  const [loading, setLoading] = useState(false)
  const [onUpgrade, setOnUpgrade] = useState(false)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });
  const initialValues = { email: '', password: '' };

  const verifyUser = async (userCode) => {
    try {
      const response = await fetch(`https://indabosky.stock-standard.com/api/email/verify/${userCode}`, );

      const result = await response.json();
      console.log("Result:", result);


      if (result.status === "success"){
        toast.success("Email Verified Successfully. Login to continue.")
        setTimeout(() => history.push("/login"), 2000)
      }
      else{
        toast.error("Email verification failed. Please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.toString());
    }
  }

  useEffect(() => {
    if (code){
      verifyUser(code)
    }

  },[])

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
        <div className="sh-11">
          <NavLink to="/">
            <img src={ziofy} style={{width: 250, height: 70}} alt="Logo"/>
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Welcome,</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Your email is being verified...</p>
        </div>
        <div>
          <Spinner style={{width: 120,height: 120}} variant="primary" animation="grow" />;
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

export default VerifyEmail;
