import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row, Accordion, useAccordionButton, Modal, InputGroup, Form} from 'react-bootstrap';
import { LAYOUT } from 'constants.js';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import useCustomLayout from 'hooks/useCustomLayout';
import {toast} from "react-toastify";
import Bitcoin from "../../../assets/upgrade/BITCOIN.png"
import Coins from "../../../assets/upgrade/COINS.png"
import Currency from "../../../assets/upgrade/CURRENCY.png"
import Increase from "../../../assets/upgrade/INCREASE.png"
import Piggy from "../../../assets/upgrade/PIGGY BANK.png"
import useCopyToClipboard from '../../../hooks/useCopyToClipboard';

function CustomAccordionToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {});
  return (
    <Card.Body className="py-4" onClick={decoratedOnClick} role="button">
      <Button variant="link" className="list-item-heading p-0">
        {children}
      </Button>
    </Card.Body>
  );
}

const MiscellaneousPricing = () => {
  const title = 'Refer Users';
  const description = 'Referrals';

  const breadcrumbs = [
    { to: '', text: 'City Crown Hotels' },
  ];

  useCustomLayout({ layout: LAYOUT.Boxed });

  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState('1000')

  const [btcWallet, setBtcWallet] = useState("");
  const [ethWallet, setEthWallet] = useState("");
  const [usdtWallet, setUsdtWallet] = useState("");
  const [recTransType, setRecTransType] = useState("deposit");
  const [value, copy] = useCopyToClipboard();

  useEffect(() => {
    // console.log("In Use Effect")
    fetch(`https://indabosky.stock-standard.com/api/wallets/select`)
        // fetch(`https://indabosky.stock-standard.com/api/wallets/select`)
        .then(response => response.json())
        .then(response => {
          // setAllUsers(response?.data?.docs)
          // console.log("Wallets: ", {response})
          setBtcWallet(response?.data?.btcWallet)
          setEthWallet(response?.data?.ethWallet)
          setUsdtWallet(response?.data?.usdtWallet)
        })
        .catch(err => {
          toast.error(err.toString())
        })
  },[])

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
        <BreadcrumbList items={breadcrumbs} />
      </div>
      {/* Title End */}

      {/* Plans Start */}
      <Row>
        <Col className="p-4">
          <div className="rounded-0 p-4 mb-4" style={{borderColor: '#6a7e95', borderStyle: 'groove', borderWidth: 0.5, }}>
            <p className="text-white font-weight-bolder">
              You can refer users by sharing your referral link:
            </p>
            <InputGroup className="mb-3">
              <Form.Control readOnly value="http://stock-standard.com/iqjyx" aria-label={ethWallet} aria-describedby="basic-addon2" />
              <Button
                  onClick={() => {
                    copy(ethWallet).then(() => {
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
            <p className="text-white font-weight-bolder">
              Or your username <span style={{ fontSize: 18 }}>King</span>
            </p>
          </div>
          <h2 className="text-white mb-4">Your Referrals</h2>
          <div className="mt-5">
            {recTransType === 'deposit' && (
                <table className="table table-responsive table-bordered">
                  <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Payment mode</th>
                    <th>Status</th>
                    <th>Date created</th>
                  </tr>
                  </thead>
                </table>
            )}
          </div>
        </Col>
      </Row>
      {/* Plans End */}

      <>
        <Modal show={modal} onHide={() => setModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Trade Upgrade</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              Hello , to upgrade your City Crown Hotels account,
              please contact our Live Chat agent to receive the appropriate payment details.
              Alternatively, you can make payments through the channels below
            </div>
            <div className="text-center bg-dark">
              Send BTC Payments to the wallet address below:<br />
              <p className="font-weight-bold">{btcWallet}</p>
              Send Etherium Payments to the wallet address below::<br />
              <p className="font-weight-bold">{ethWallet}</p>
              Send USDT Payments to the wallet address below:<br />
              <p className="font-weight-bold">{usdtWallet}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setModal(false)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default MiscellaneousPricing;
