import React, {useEffect, useState} from 'react';
import { Button, Card, Col, Row, Accordion, useAccordionButton, Modal } from 'react-bootstrap';
import { LAYOUT } from 'constants.js';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import useCustomLayout from 'hooks/useCustomLayout';
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import Bitcoin from "../../../assets/upgrade/BITCOIN.png"
import Coins from "../../../assets/upgrade/COINS.png"
import Currency from "../../../assets/upgrade/CURRENCY.png"
import Increase from "../../../assets/upgrade/INCREASE.png"
import Piggy from "../../../assets/upgrade/PIGGY BANK.png"
import {allInvestments} from "../../../services/investmentService";
import {allDeposits} from "../../../services/depositService";
import {getSumByKey} from "../../../assets/functions";
import {allWithdrawals} from "../../../services/withdrawalService";

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
  const title = 'Transaction Records';
  const description = 'History';

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
  const [withdrawals, setWithdrawals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [deposits, setDeposits] = useState([]);

  const { currentUser } = useSelector((state) => state.auth);
  console.log({ currentUser });


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

  useEffect(() => {
    allInvestments(1,1000)
        .then(res => {
          setInvestments(res)
        })
  }, []);

  useEffect(() => {
    allDeposits(1, 1000).then((response) => {
      // console.log("Deposits: ", {response})
      const total = getSumByKey(response, 'amount')
      setDeposits(response)
      // setTotalDeposits(total)
    })
  }, [currentUser]);

  useEffect(() => {
    allWithdrawals(1, 1000).then((response) => {
      console.log("Withdrawals: ", {response})
      const total = getSumByKey(response, 'amount')
      console.log({total})
      setWithdrawals(response)
      // setTotalWithdrawals(total)
      // setWithdrawals(response)
    })
  }, [currentUser]);

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
          <h2 className="text-white mb-4">Recent Transactions</h2>
          <button type="button" className={recTransType === 'deposit'? "btn btn-primary rounded-2": "btn btn-muted rounded-2" }
                  onClick={() => setRecTransType('deposit')}>
            Deposit
          </button>
          <button
              type="button"
              className={recTransType === 'withdrawal' ? 'btn btn-primary rounded-2' : 'btn btn-muted rounded-2'}
              style={{ marginLeft: 20 }} onClick={() => setRecTransType('withdrawal')}>
            Withdrawal
          </button>
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
                  <tbody>
                  {
                    deposits?.map((item, idx) => {
                      return <tr key={idx}>
                        <td>{item?.amount}</td>
                        <td>{item?.method}</td>
                        <td>{item?.status}</td>
                        <td>{new Date(item?.date).toDateString()}</td>
                      </tr>
                    })
                  }
                  </tbody>
                </table>
            )}
            {recTransType === 'withdrawal' && (
                <table className="table table-responsive table-bordered">
                  <thead>
                  <tr>
                    <th>Amount requested</th>
                    <th>Amount + charges</th>
                    <th>Receiving mode</th>
                    <th>Status</th>
                    <th>Date created</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    withdrawals?.map((item, idx) => {
                      return <tr key={idx}>
                        <td>{item?.amount}</td>
                        <td>{item?.amount}</td>
                        <td>{item?.method}</td>
                        <td>{item?.status}</td>
                        <td>{new Date(item?.date).toDateString()}</td>
                      </tr>
                    })
                  }
                  </tbody>
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
