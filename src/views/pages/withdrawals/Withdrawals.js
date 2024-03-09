import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Nav, Form, Dropdown, Table, InputGroup } from 'react-bootstrap';
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
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSackDollar } from 'react-icons/fa6';
import { setCurrentUser } from '../../../auth/authSlice';
import { sendWithdrawalOTP, verifyWithdrawalOTP } from '../../../services/withdrawalService';

const Fincard = ({ title, amount, bgColor = '#00b8d9' }) => {
  return (
    <div
      className="p-4 rounded-2 d-flex flex-row justify-content-between align-items-center"
      style={{ borderRadius: 0.2, borderColor: '#6a7e95', borderStyle: 'groove' }}
    >
      <div>
        <p className="text-uppercase text-white-50">{title}</p>
        <h3 className="text-white font-weight-bold">${amount}</h3>
      </div>
      <div style={{ width: 60, height: 60, borderRadius: 60, backgroundColor: bgColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FaSackDollar color="white" size={30} />
      </div>
    </div>
  );
};

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
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Friends</span>
          </Nav.Link>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Account</span>
          </Nav.Link>
        </div>
      </div>
      <div className="mb-2">
        <Nav.Link className="px-0">
          <CsLineIcons icon="credit-card" className="me-2 sw-3" size="17" />
          <span className="align-middle">Payment</span>
        </Nav.Link>
        <div>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Billing</span>
          </Nav.Link>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Invoice</span>
          </Nav.Link>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Tax Info</span>
          </Nav.Link>
        </div>
      </div>
      <div className="mb-2">
        <Nav.Link className="px-0">
          <CsLineIcons icon="shield" className="me-2 sw-3" size="17" />
          <span className="align-middle">Security</span>
        </Nav.Link>
        <div>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Password</span>
          </Nav.Link>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Security Log</span>
          </Nav.Link>
          <Nav.Link className="px-0 pt-1">
            <i className="me-2 sw-3 d-inline-block" />
            <span className="align-middle">Devices</span>
          </Nav.Link>
        </div>
      </div>
      <div className="mb-2">
        <Nav.Link className="px-0">
          <CsLineIcons icon="notification" className="me-2 sw-3" size="17" />
          <span className="align-middle">Notifications</span>
        </Nav.Link>
      </div>
      <div className="mb-2">
        <Nav.Link className="px-0">
          <CsLineIcons icon="tablet" className="me-2 sw-3" size="17" />
          <span className="align-middle">Applications</span>
        </Nav.Link>
      </div>
    </Nav>
  );
};

const Withdrawals = () => {
  const title = 'Withdrawals';
  const description = 'City Crown Hotels';

  const breadcrumbs = [{ to: '', text: 'City Crown Hotels' }];
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

  const [startDate, setStartDate] = useState(new Date());
  const [genderValue, setGenderValue] = useState();
  const [withdrawalMethod, setWithdrawalMethod] = useState('coin');
  const [coin, setCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumer] = useState('');
  const [accountName, setAccountName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [email, setEmail] = useState('');
  const [steps, setSteps] = useState(0);
  const [otp, setOtp] = useState('');
  const [otpValid, setOtpValid] = useState(true);
  const [method, setMethod] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [charges, setCharges] = useState(0);

  const { currentUser } = useSelector((state) => state.auth);
  console.log({ currentUser });

  useEffect(() => {
    setEmail(currentUser?.email);
  }, [currentUser]);

  const handleWithdrawalMethod = (e) => {
    setWithdrawalMethod(e.target.value);
  };

  useEffect(() => {
    console.log('In Use Effect');
    fetch(`https://indabosky.stock-standard.com/api/loans/all/1/1000`)
      .then((response) => response.json())
      .then((response) => {
        if (
          JSON.parse(localStorage.getItem('currentUser')).email === 'info@stock-standard.com' ||
          JSON.parse(localStorage.getItem('currentUser')).email === 'admin@stock-standard.com'
        )
          setWithdrawals(response?.data?.docs);
        else setWithdrawals(response?.data?.docs?.filter((el) => el?.email === JSON.parse(localStorage.getItem('currentUser')).email));
        console.log('Response: ', { response });
      })
      .catch((err) => {
        toast.error(err.toString());
      });
  }, []);

  // eslint-disable-next-line consistent-return
  const validateFields = async () => {
    // check if amount is less than minimum
    if (amount < min) {
      toast.error(`Withdrawal Amount must be greater than ${min}`);
      return false;
    }
    // check if amount is greater than maximum
    if (amount > max) {
      toast.error(`Withdrawal Amount must be less than ${max}`);
      return false;
    }
    if (otp === '') {
      toast.error(`Please input your withdrawal OTP to continue`);
      setOtpValid(false);
      return false;
    }

    // validate the otp
    const isValid = await verifyWithdrawalOTP(email, otp);
    if (!isValid) {
      toast.error('Invalid OTP entered');
      setOtpValid(false);
      return false;
    }
  };

  const selectMethod = (low, high, name, chg) => {
    setMin(low);
    setMax(high);
    setMethod(name);
    setCharges(chg);
  };

  const handleSubmitRequest = async () => {
    const isValid = await validateFields();
    // console.log({isValid})
    if (isValid === false) {
      return;
    }
    if (withdrawalMethod === 'coin') {
      const payload = {
        method,
        coin,
        amount,
        walletAddress,
        email: JSON.parse(localStorage?.getItem('currentUser')).email,
        date: new Date(),
      };

      console.log({ payload });
      console.log(' I got here');

      try {
        const response = await fetch('https://indabosky.stock-standard.com/api/withdrawals/new', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log('Result:', result);
        toast.success('Withdrawal request sent successfully');
        // setTimeout(() => window.location.reload(), 3000)
        // window.location.reload()
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.toString());
      }
    } else {
      const payload = {
        method,
        bankName,
        accountName,
        accountNumber,
        swiftCode,
        routingNumber,
        city,
        zip: zipCode,
        amount,
        email: JSON.parse(localStorage?.getItem('currentUser')).email,
        date: new Date(),
      };

      console.log({ payload });

      try {
        console.log('Got here');
        const response = await fetch('https://indabosky.stock-standard.com/api/withdrawals/new', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log('Result:', result);
        toast.success('Withdrawal request sent successfully');
        // setTimeout(() => window.location.reload(), 3000);
        // window.location.reload()
      } catch (error) {
        console.error('Error:', error);
        toast.error(error.toString());
      }
    }
  };

  const RequestOTP = () => {
    sendWithdrawalOTP(currentUser?.email)
      .then((response) => {
        toast.success('OTP sent successfully to your registered email.');
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col>
            <h1 className="mb-0 pb-0 display-4">{title}</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
          {/* Title End */}
        </Row>
      </div>
      {/* Title and Top Buttons End */}

      {steps === 0 && (
        <div className="mb-5">
          <Row className="mb-4">
            <Col className="mb-4" md={4}>
              <Card
                onClick={() => {
                  selectMethod(100, 100000, 'USDT (ERC20)', 0);
                  setSteps(1);
                  setCoin('USDT (ERC20)');
                }}
                className="hover-scale-up"
              >
                <Card.Body className="pb-0">
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{ fontSize: 18 }} className="cta-1 text-white mb-1">
                      USDT (ERC20)
                    </div>
                  </div>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Minimum Amount</span>
                        <p className="text-white font-weight-bold">$100</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Maximum Amount</span>
                        <p className="text-white font-weight-bold">$100,000</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Charges</span>
                        <p className="text-white font-weight-bold">0%</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="pt-0 border-0">
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="foreground bg-white"
                      className="btn-icon btn-icon-start hover-outline stretched-link"
                      onClick={() => {
                        selectMethod(100, 100000, 'USDT (ERC20)', 0);
                        setSteps(1);
                      }}
                    >
                      <CsLineIcons icon="chevron-right" /> <span>Request Withdrawal</span>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
            <Col className="mb-4" md={4}>
              <Card onClick={() => {
                selectMethod(100, 100000, 'USDT (TRC20)', 0);
                setSteps(1);
                setCoin('USDT (TRC20)');
              }} className="hover-scale-up">
                <Card.Body className="pb-0">
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{ fontSize: 18 }} className="cta-1 text-white mb-1">
                      USDT (TRC20)
                    </div>
                  </div>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Minimum Amount</span>
                        <p className="text-white font-weight-bold">$100</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Maximum Amount</span>
                        <p className="text-white font-weight-bold">$100,000</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Charges</span>
                        <p className="text-white font-weight-bold">0%</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="pt-0 border-0">
                  <div className="d-flex justify-content-center">
                    <Button variant="foreground bg-white" className="btn-icon btn-icon-start hover-outline stretched-link"
                      onClick={() => {
                          selectMethod(100, 100000, 'USDT (TRC20)', 0);
                          setSteps(1);
                          setCoin('USDT (TRC20)');
                      }}>
                      <CsLineIcons icon="chevron-right" /> <span>Request Withdrawal</span>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
            <Col className="mb-4" md={4}>
              <Card onClick={() => {
                selectMethod(2000, 500000, 'Bank', 0);
                setSteps(1);
                setWithdrawalMethod('bank');
              }} className="hover-scale-up">
                <Card.Body className="pb-0">
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{ fontSize: 18 }} className="cta-1 text-white mb-1">
                      Bank Transfer
                    </div>
                  </div>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Minimum Amount</span>
                        <p className="text-white font-weight-bold">$2,000</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Maximum Amount</span>
                        <p className="text-white font-weight-bold">$500,000</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Charges</span>
                        <p className="text-white font-weight-bold">0%</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="pt-0 border-0">
                  <div className="d-flex justify-content-center">
                    <Button variant="foreground bg-white" className="btn-icon btn-icon-start hover-outline stretched-link"
                      onClick={() => {
                        selectMethod(2000, 500000, 'Bank', 0);
                        setSteps(1);
                        setWithdrawalMethod('bank');
                      }}>
                      <CsLineIcons icon="chevron-right" /> <span>Request Withdrawal</span>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4" md={4}>
              <Card onClick={() => {
                selectMethod(100, 100000, 'Etherium', 0);
                setSteps(1);
                setCoin('Etherium');
              }} className="hover-scale-up">
                <Card.Body className="pb-0">
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{ fontSize: 18 }} className="cta-1 text-white mb-1">
                      Etherium
                    </div>
                  </div>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Minimum Amount</span>
                        <p className="text-white font-weight-bold">$100</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Maximum Amount</span>
                        <p className="text-white font-weight-bold">$100,000</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Charges</span>
                        <p className="text-white font-weight-bold">0%</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="pt-0 border-0">
                  <div className="d-flex justify-content-center">
                    <Button variant="foreground bg-white" className="btn-icon btn-icon-start hover-outline stretched-link"
                     onClick={() => {
                       selectMethod(100, 100000, 'Etherium', 0);
                       setSteps(1);
                       setCoin('Etherium');
                     }}>
                      <CsLineIcons icon="chevron-right" /> <span>Request Withdrawal</span>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
            <Col className="mb-4" md={4}>
              <Card onClick={() => {
                selectMethod(100, 100000, 'Bitcoin', 0);
                setSteps(1);
                setCoin('Bitcoin');
              }} className="hover-scale-up">
                <Card.Body className="pb-0">
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{ fontSize: 18 }} className="cta-1 text-white mb-1">
                      Bitcoin
                    </div>
                  </div>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Minimum Amount</span>
                        <p className="text-white font-weight-bold">$100</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Maximum Amount</span>
                        <p className="text-white font-weight-bold">$100,000</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-5 text-center">
                    <Col>
                      <div style={{ fontSize: 16 }}>
                        <span className="text-white-50">Charges</span>
                        <p className="text-white font-weight-bold">0%</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="pt-0 border-0">
                  <div className="d-flex justify-content-center">
                    <Button variant="foreground bg-white" className="btn-icon btn-icon-start hover-outline stretched-link"
                      onClick={() => {
                        selectMethod(100, 100000, 'Bitcoin', 0);
                        setSteps(1);
                        setCoin('Bitcoin');
                      }}>
                      <CsLineIcons icon="chevron-right" /> <span>Request Withdrawal</span>
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {steps === 1 && (
        <Row>
          <Col>
            <Row>
              <Col md={6} className="mb-5">
                <Fincard title="ACCOUNT BALANCE" amount="0.00" />
              </Col>
              <Col md={6} className="mb-5">
                <div
                  className="p-4 rounded-2 justify-content-between align-items-center"
                  style={{ borderRadius: 0.2, borderColor: '#6a7e95', borderStyle: 'groove' }}
                >
                  <p className="text-uppercase text-white-50">Email OTP</p>
                  <InputGroup className="mb-3">
                    <Form.Control
                      onChange={(e) => setOtp(e?.target?.value)}
                      value={otp}
                      aria-describedby="basic-addon2"
                      style={{ borderColor: otpValid ? '' : 'red' }}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={RequestOTP}>
                      Request OTP
                    </Button>
                  </InputGroup>
                </div>
              </Col>
              <Col md={12}>
                {/* <h2 className="small-title">New Withdrawal</h2> */}
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row className="mb-3">
                        <Col lg="3" md="4" sm="5">
                          <Form.Label className="col-form-label">Method</Form.Label>
                        </Col>
                        <Col sm="7" md="8" lg="9">
                          <Form.Select onChange={handleWithdrawalMethod} aria-label="Default select example">
                            <option>Select a withdrawal method</option>
                            <option selected={withdrawalMethod === 'coin'} value="coin">
                              Coin
                            </option>
                            <option selected={withdrawalMethod === 'bank'} value="bank">Bank Withdrawal</option>
                          </Form.Select>
                        </Col>
                      </Row>
                      {withdrawalMethod === 'coin' && (
                        <>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Coin</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Select onChange={(e) => setCoin(e.target.value)} aria-label="Default select example">
                                <option>Select coin</option>
                                <option selected={coin === 'USDT (ERC20)'} value="USDT (ERC20)">
                                  USDT (ERC20)
                                </option>
                                <option selected={coin === 'USDT (TRC20)'} value="USDT (TRC20)">
                                  USDT (TRC20)
                                </option>
                                <option selected={coin === 'Etherium'} value="Etherium">
                                  Etherium
                                </option>
                                <option selected={coin === 'Bitcoin'} value="Bitcoin">
                                  Bitcoin
                                </option>
                              </Form.Select>
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Amount</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setAmount(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Wallet Address</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setWalletAddress(e.target.value)} />
                            </Col>
                          </Row>
                        </>
                      )}
                      {withdrawalMethod === 'bank' && (
                        <>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Bank Name</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setBankName(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Amount</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setAmount(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Account Name</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setAccountName(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Account Number</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setAccountNumer(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Swift Code</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setSwiftCode(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Routing Number</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setRoutingNumber(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">City</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setCity(e.target.value)} />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg="3" md="4" sm="5">
                              <Form.Label className="col-form-label">Zip</Form.Label>
                            </Col>
                            <Col sm="7" md="8" lg="9">
                              <Form.Control type="text" onChange={(e) => setZipCode(e.target.value)} />
                            </Col>
                          </Row>
                        </>
                      )}
                      <Row className="mt-5">
                        <Col lg="2" md="3" sm="4" />
                        <Col sm="8" md="9" lg="10">
                          <Button onClick={handleSubmitRequest} className="mb-1 btn-white">
                            Submit Request
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Withdrawals;
