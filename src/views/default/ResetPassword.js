import React, {useState} from 'react';
import {NavLink, useHistory, useParams} from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import {toast} from "react-toastify";
import ziofy from "../../assets/ziofy.png";

const ResetPassword = () => {
  const history = useHistory();
  const { code } = useParams()
  const [loading, setLoading] = useState(false);

  const title = 'Reset Password';
  const description = 'Reset Password Page';
  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
    passwordConfirm: Yup.string()
      .required('Password Confirm is required')
      .oneOf([Yup.ref('password'), null], 'Must be same with password!'),
  });
  const initialValues = { password: '', passwordConfirm: '' };

  // // console.log({code})

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await fetch(`https://indabosky.stock-standard.com/api/email/reset/${code}`,{
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      } );

      const result = await response.json();
      // console.log("Result:", result);


      if (result.status === "success"){
        toast.success("Email Reset Successfully. Login to continue.")
        setLoading(false)
        setTimeout(() => history.push("/login"), 2000)
      }
      else{
        toast.error("Password reset failed. Please try again");
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Password reset failed: ", error?.msg?.toString() ?? error.toString());
      setLoading(false)
    }
  }
  // const onSubmit = (values) => // console.log('submit form', values);

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">Multiple Niches</h1>
            <h1 className="display-3 text-white">Ready for Your Project</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before
            process-centric communities...
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
          <h2 className="cta-1 mb-0 text-primary">Password trouble?</h2>
          <h2 className="cta-1 text-primary">Reset it here!</h2>
        </div>
        <div className="mb-5 text-center">
          <p className="h6">Please use below form to reset your password.</p>
        </div>
        <div>
          <form id="resetForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <div className="mb-3 filled">
              <CsLineIcons icon="lock-on" />
              <Form.Control type="password" name="passwordConfirm" onChange={handleChange} value={values.passwordConfirm} placeholder="Verify Password" />
              {errors.passwordConfirm && touched.passwordConfirm && <div className="d-block invalid-tooltip">{errors.passwordConfirm}</div>}
            </div>
            <Button disabled={loading} className="w-100 rounded-2" size="lg" type="submit">
              {
                loading? "Resetting Password...":
                "Reset Password"
              }
            </Button>
            <p className="h6 mt-5 text-center">
              If you are a member, please <NavLink to="/login">login</NavLink>.
            </p>
          </form>
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

export default ResetPassword;
