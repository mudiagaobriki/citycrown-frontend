import React, { useEffect, useState } from 'react';
import { Row, Col, Card, InputGroup, Button, Form, Modal } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { toast, ToastContainer } from 'react-toastify';
import { FaArrowRightLong } from 'react-icons/fa6';
import {useDispatch, useSelector} from "react-redux";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Bitcon1 from '../../assets/crypto/Bitcoin1.png';
import Bitcon2 from '../../assets/crypto/bitcoin.png';
import Etherium1 from '../../assets/crypto/etherium.png';
import Etherium2 from '../../assets/crypto/etherium2.png';
import USDT from '../../assets/crypto/usdt.png';
import BNB from '../../assets/crypto/bnb.png';
import usdt2 from '../../assets/payment-options/USDT.png';
import btc2 from '../../assets/payment-options/BTC.png';
import eth2 from '../../assets/payment-options/ETH.png';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import {setDepositAmount, setDepositMethod} from "../../auth/depositSlice";
import storage from "../../firebase.config"
import {allDeposits, newDeposit} from "../../services/depositService";
import {getSumByKey} from "../../assets/functions";

const DashboardsPage = () => {
  const [value, copy] = useCopyToClipboard();
  const [amount, setAmount] = useState(0);
  const [step, setStep] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [btcWallet, setBtcWallet] = useState('');
  const [ethWallet, setEthWallet] = useState('');
  const [usdtWallet, setUsdtWallet] = useState('');
  const [usdtWallet2, setUsdtWallet2] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAlias, setPaymentAlias] = useState('');
  const [amountError, setAmounrError] = useState(false);
  const [amountErrorText, setAmounrErrorText] = useState('');
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState(false);
  const [totalDeposits, setTotalDeposits] = useState(false);

  const title = 'Fund your account';
  const description = 'Make a deposit into any of the wallets below to fund your account.';
  const breadcrumbs = [{ to: '', text: 'City Crown Hotels' }];
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });

  useEffect(() => {
    setEmail(currentUser?.email)
  },[currentUser])

  useEffect(() => {
    allDeposits(1, 1000).then((response) => {
      // console.log("Deposits: ", {response})
      const mine = response?.filter(el => el?.email === currentUser?.email)
      const total = getSumByKey(mine, 'amount')
      setDeposits(mine)
      setTotalDeposits(total)
    })
  }, [currentUser]);

  const PaymentOption = ({ image, text, val, checked, onPress = {} }) => {
    return (
      <div
        className="h-100 w-100 p-4 d-flex align-items-center rounded-2"
        style={{ justifyContent: 'space-between', borderColor: 'lightgray', borderStyle: 'solid', borderWidth: 0.5 }}
      >
        <div className="d-flex align-items-center align-self-center">
          <img src={image} alt="payment-image" style={{ width: 25, height: 25, marginRight: 15 }} />
          <span className="text-white-50 font-weight-bold align-self-center">{text}</span>
        </div>
        <input className="form-check-input" type="checkbox" value={val} onClick={onPress} style={{ alignSelf: 'float-right' }} checked={checked} />
      </div>
    );
  };

  // useEffect(() => {
  //   // console.log("In Use Effect")
  //   fetch(`https://indabosky.stock-standard.com/api/wallets/select`)
  //     // fetch(`https://indabosky.stock-standard.com/api/wallets/select`)
  //     .then((response) => response.json())
  //     .then((response) => {
  //       // setAllUsers(response?.data?.docs)
  //       // console.log("Wallets: ", {response})
  //       setBtcWallet(response?.data?.btcWallet);
  //       setEthWallet(response?.data?.ethWallet);
  //       setUsdtWallet(response?.data?.usdtWallet);
  //     })
  //     .catch((err) => {
  //       toast.error(err.toString());
  //     });
  // }, []);

  useEffect(() => {
    // console.log("In Use Effect")
    fetch(`https://indabosky.stock-standard.com/api/wallets/6560fa6d0dc0660fbbcfe2c5`)
        // fetch(`https://indabosky.stock-standard.com/api/wallets/select`)
        .then(response => response.json())
        .then(response => {
          // setAllUsers(response?.data?.docs)
          // console.log("Wallets: ", {response})
          setBtcWallet(response?.data?.btcWallet)
          setEthWallet(response?.data?.ethWallet)
          setUsdtWallet(response?.data?.usdtWallet)
          setUsdtWallet2(response?.data?.usdtWallet2)
        })
        .catch(err => {
          // toast.error(err.toString())
        })
  },[])

  useEffect(() => {
    if (paymentMethod === 'ERC20'){
      setPaymentAlias('USDT (ERC20)')
      setWalletAddress(usdtWallet)
    }
    else if (paymentMethod === 'TRC20'){
      setPaymentAlias('USDT (TRC20)')
      setWalletAddress(usdtWallet2)
    }
    else if (paymentMethod === 'ETH'){
      setPaymentAlias('Etherium')
      setWalletAddress(ethWallet)
    }
    else if (paymentMethod === 'BTC'){
      setPaymentAlias('Bitcoin')
      setWalletAddress(btcWallet)
    }
  },[paymentMethod])

  const ProceedToPayment = () => {
    if (amount === 0) {
      setAmounrError(true);
      setAmounrErrorText('Please input a valid amount.');
    } else if (paymentMethod === '') {
      toast.error('Please select a payment method to proceed.');
    } else {
      // do dispatches here
      // dispatch(setDepositAmount(amount));
      // dispatch(setDepositMethod(paymentMethod));

      setAmounrError(false);
      setAmounrErrorText('');
      setStep(1);
    }
  };

  const AmountChanged = (val) => {
    // check if amount is valid
    if (val > 0){
      setAmounrError(false);
      setAmounrErrorText('');
      setAmount(val);
    }
    else{
      setAmount(0);
    }
  }

  function handleUpload() {
    setLoading(true)
    if (!file) {
      alert("Please choose a file first!")
    }
    // const storageRef = ref(storage, `/files/${file.name}`)
    const storageRef = ref(storage, `/files/${Date.now()}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          // setPercent(percent);
        },
        (err) => {
          alert("Error uploading file. Please try again.")
          console.log("File upload error: ", err)
        },
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFileUrl(url);
            // console.log({
            //   paymentMethod, amount, url, email,
            // })
            const payload = {email, amount, method: paymentMethod, proofUrl: url}
            newDeposit(payload)
                .then(response => {
                  // console.log({response})
                  toast.success("Funding Successful")
                  window.location.reload()
                })
                .catch(err => {
                  toast.error("Error is funding your account.Please try again.")
                  // console.log({err})
                })
          });
        }
    );
    setLoading(false)
  }

  const SubmitPayment = () => {
    handleUpload()
    // console.log({
    //   paymentMethod, amount, fileUrl, email,
    // })
  }

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Row>
        <Col>
          {/* Title Start */}
          <section className="scroll-section" id="title">
            <div className="page-title-container">
              <h1 className="mb-0 pb-0 display-4">{title}</h1>
              <BreadcrumbList items={breadcrumbs} />
            </div>
          </section>
          {/* Title End */}
        </Col>
      </Row>
      {step === 0 && (
        <>
          <Row>
            <Col className="p-4 rounded-2 mr-2" md={8} style={{ backgroundColor: '#242424' }}>
              <p className="text-white font-weight-bold mb-4">Enter Amount</p>
              <input type="number" min={0} placeholder="Enter Amount" onChange={(el) => AmountChanged(el?.target?.value)}
                     className="form-control bg-transparent form-control-lg rounded-2"
                     style={{ borderColor: amountError? "red": "", marginBottom: !amountError? 30: 0, }}/>
              {amountError && <p className="text-danger mb-7">{amountErrorText}</p>}
              <p className="text-white font-weight-bold mb-4">Choose payment method from the list below</p>
              <Row>
                <Col md={6} className="mb-3">
                  <PaymentOption text="USDT (ERC20)" image={usdt2} onPress={() => setPaymentMethod('ERC20')} checked={paymentMethod === 'ERC20'} />
                </Col>
                <Col md={6} className="mb-3">
                  <PaymentOption text="USDT (TRC20)" image={usdt2} onPress={() => setPaymentMethod('TRC20')} checked={paymentMethod === 'TRC20'} />
                </Col>
              </Row>
              <Row className="mb-7">
                <Col md={6} className="mb-3">
                  <PaymentOption text="Etherium" image={eth2} val="" onPress={() => setPaymentMethod('ETH')} checked={paymentMethod === 'ETH'} />
                </Col>
                <Col md={6} className="mb-3">
                  <PaymentOption text="Bitcoin" image={btc2} onPress={() => setPaymentMethod('BTC')} checked={paymentMethod === 'BTC'} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <button onClick={ProceedToPayment} type="button" className="btn btn-lg btn-block btn-danger w-100" style={{ height: 55, fontSize: 18 }}>
                    Proceed to Payment
                  </button>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="p-4 rounded-2" style={{ backgroundColor: '#242424' }}>
              <div className="p-5 rounded-2 mb-4" style={{ backgroundColor: '#283e4a' }}>
                <p>Total Deposit</p>
                <h3 className="text-white font-weight-bold">${Number(totalDeposits)?.toLocaleString()}</h3>
              </div>
              <p className="text-white-50 font-weight-bold">
                <span>View Deposit History</span>
                <FaArrowRightLong size={20} className="text-white-50" style={{ marginLeft: 20 }} />
              </p>
            </Col>
          </Row>
        </>
      )}
      {step === 1 && (
        <>
          <Row>
            <Col className="p-4">
              <Row className="text-center align-items-center justify-content-center">
                <Col
                  className="p-4 rounded-2"
                  md={8}
                  sm={12}
                  style={{ borderColor: '#6a7e95', borderStyle: 'initial', borderWidth: 0.5, backgroundColor: '#242424' }}
                >
                  <div className="d-flex py-2 px-4 px-sm-0 justify-content-center mb-5" style={{ borderRadius: 30, backgroundColor: '#e4c07b' }}>
                    <div className="text-white font-weight-bold py-2 px-4" style={{ borderRadius: 30, backgroundColor: '#ffa60a' }}>
                      Your payment method: <span className="h3 text-white font-weight-bold">{paymentMethod}</span>
                    </div>
                  </div>
                  <p className="text-white font-weight-bold mb-7">You are to make payment of ${Number(amount)?.toLocaleString('en-US')} using your selected payment method.</p>
                  <div className="rounded-0 p-4 mb-4" style={{ borderColor: '#6a7e95', borderStyle: 'groove', borderWidth: 0.5 }}>
                    <p className="text-white font-weight-bolder">{paymentAlias} Address:</p>
                    <InputGroup className="mb-3">
                      <Form.Control readOnly value={walletAddress} aria-label={ethWallet} aria-describedby="basic-addon2" />
                      <Button
                        onClick={() => {
                          copy(walletAddress).then(() => {
                            toast.success('Wallet Address copied successfully.', {
                              autoClose: 5000,
                            });
                          });
                        }}
                        variant="outline-secondary"
                        id="button-addon2"
                      >
                        Copy
                      </Button>
                    </InputGroup>
                    <p className="text-white font-weight-bolder">Network Type: {paymentMethod}</p>
                  </div>
                  <div className="rounded-0 p-4 mb-4" style={{ borderColor: '#6a7e95', borderStyle: 'groove', borderWidth: 0.5 }}>
                    <p className="text-white font-weight-bolder mb-4">Buy USDT (ERC20) from any of the websites below if you don't have enough to deposit</p>
                    <Row>
                      <Col md={4} className="mb-2">
                        <button
                          onClick={() => {
                            window.location.href = 'https://moonpay.com/buy';
                          }}
                          type="button"
                          className="btn btn-white w-100 btn-lg rounded-2"
                        >
                          <span style={{ fontWeight: 700 }}>MoonPay</span>
                        </button>
                      </Col>
                      <Col md={4} className="mb-2">
                        <button
                          onClick={() => {
                            window.location.href = 'https://chengelly.com/buy-crypto';
                          }}
                          type="button"
                          className="btn btn-white btn-lg w-100 rounded-2"
                        >
                          <span style={{ fontWeight: 700 }}>Changelly</span>
                        </button>
                      </Col>
                      <Col md={4} className="mb-2">
                        <button
                          onClick={() => {
                            window.location.href = 'https://paybis.com';
                          }}
                          type="button"
                          className="btn btn-white btn-lg w-100 rounded-2"
                        >
                          <span style={{ fontWeight: 700 }}>PayBis</span>
                        </button>
                      </Col>
                    </Row>
                  </div>
                  <div className="rounded-0 p-4" style={{ borderColor: '#6a7e95', borderStyle: 'groove', borderWidth: 0.5 }}>
                    <p className="text-white font-weight-bolder mb-4">Upload Payment proof after payment.</p>
                    <Form.Group controlId="paymentDocument" className="mb-3">
                      <Form.Control type="file" size="lg" onChange={(event) => setFile(event.target.files[0])} />
                    </Form.Group>
                  </div>
                  <button disabled={loading} onClick={SubmitPayment} type="button" className="btn btn-block w-100 btn-lg btn-white mt-7" style={{ height: 55, fontWeight: 700, fontSize: 18 }}>
                    {
                      loading? "Submitting...": "Submit Payment"
                    }
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
      {/* List Items Start */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Trade Upgrade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center h4 mb-3">
            Send Payment equivalent of ${amount} to the {paymentMethod} wallet below:
          </div>
          <div className="text-center bg-dark py-5 rounded-2">
            <p className="font-weight-bold">{walletAddress}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              copy(walletAddress).then(() => {
                toast.success('Wallet Address copied successfully.', {
                  autoClose: 5000,
                });
                setTimeout(() => setShowModal(false), 2000);
              });
            }}
            variant="danger"
          >
            Copy
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
            }}
            variant="secondary"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* List Items End */}
    </>
  );
};

export default DashboardsPage;
