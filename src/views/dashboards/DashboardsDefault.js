import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Table } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { NavLink } from 'react-router-dom';
import { Steps } from 'intro.js-react';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Glide from 'components/carousel/Glide';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ChartLargeLineSales from 'views/interface/plugins/chart/ChartLargeLineSales';
import ChartLargeLineStock from 'views/interface/plugins/chart/ChartLargeLineStock';
import {
  AdvancedRealTimeChart,
  CryptoCurrencyMarket,
  MarketOverview,
  MiniChart, Screener,
  TickerTape, Timeline
} from 'react-ts-tradingview-widgets';
import 'intro.js/introjs.css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaSackDollar } from 'react-icons/fa6';
import ChartDoughnut from '../interface/plugins/chart/ChartDoughnut';
import ChartPie from '../interface/plugins/chart/ChartPie';
import ChartRadar from '../interface/plugins/chart/ChartRadar';
import Bag from '../../assets/icons/Bag.png';
import {getUser} from "../../services/authService";
import {allDeposits} from "../../services/depositService";
import {allWithdrawals} from "../../services/withdrawalService";
import {getSumByKey} from "../../assets/functions";
import {allInvestments} from "../../services/investmentService";

const cryptoTabs = [
  {
    "title": "Crypto",
    "symbols": [
      {
        "s": "BINANCE:BTCUSDT",
        "d": "BTCUSDT"
      },
      {
        "s": "BINANCE:ETHUSDT"
      },
      {
        "s": "CRYPTOCAP:USDT.D"
      },
      {
        "s": "BINANCE:BNBUSDT"
      },
      {
        "s": "CRYPTOCAP:USDC"
      },
      {
        "s": "BINANCE:XRPUSDT"
      }
    ]
  }
]

const defiTabs = [
  {
    "title": "Crypto",
    "symbols": [
      {
        "s": "NEO:DEFI"
      },
      {
        "s": "COINBASE:UNIUSD"
      },
      {
        "s": "BINANCE:AVAXUSD"
      },
      {
        "s": "COINBASE:WBTCUSD"
      },
      {
        "s": "COINBASE:LINKUSD"
      },
      {
        "s": "BINANCE:THETAUSD"
      }
    ]
  }
]

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

const DashboardsDefault = () => {
  const title = 'Dashboard';
  const description = 'Default Dashboard';

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Dashboards' },
  ];

  const [fetching, setFetching] = useState(true);
  const [balance, setBalance] = useState('0.00');
  const [capital, setCapital] = useState('0.00');
  const [bonus, setBonus] = useState('0.00');
  const [accountType, setAccountType] = useState(true);
  const [recTransType, setRecTransType] = useState('deposit');
  const [email, setEmail] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [totalWithdrawals, setTotalWithdrawals] = useState('');
  const [totalDeposits, setTotalDeposits] = useState('');


  // const [userDetails, setUserDetails] = useState({})
  //

  const { currentUser } = useSelector((state) => state.auth);
  // console.log({ currentUser });

  useEffect(() => {
    setEmail(currentUser?.email);

    getUser(currentUser?.email)
        // .then((response) => response.json())
        .then((response) => {
          // console.log("mu-response", { response });
          const myData = response?.data;
          setBalance(myData?.balance ?? '0.00');
          setCapital(myData?.capital ?? '0.00');
          setBonus(myData?.bonus ?? '0.00');
          setAccountType(myData?.accountType ?? '0.00');
          setFetching(false);
          // // console.log("Details: ", {response})
        })
        .catch((err) => {
          toast.error('Error fetching user details.');
          // console.log("Error fetching user: ", err)
        });
  }, [currentUser]);

  useEffect(() => {
    allInvestments(1,1000)
        .then(res => {
          const mine = res?.filter(el => el?.email === currentUser?.email)
          setInvestments(mine)
        })
  }, []);

  useEffect(() => {
    // const userEmail = JSON.parse(localStorage?.getItem('currentUser')).email;
    // if (currentUser){
    //   getUser(email)
    //       // .then((response) => response.json())
    //       .then((response) => {
    //         console.log("mu-response", { response });
    //         const myData = response?.data;
    //         setBalance(myData?.balance ?? '0.00');
    //         setCapital(myData?.capital ?? '0.00');
    //         setBonus(myData?.bonus ?? '0.00');
    //         setAccountType(myData?.accountType ?? '0.00');
    //         setFetching(false);
    //         // console.log("Details: ", {response})
    //       })
    //       .catch((err) => {
    //         toast.error('Error fetching user details.');
    //         console.log("Error fetching user: ", err)
    //       });
    // }

  }, [currentUser]);


  useEffect(() => {
    allDeposits(1, 1000).then((response) => {
          // console.log("Deposits: ", {response})
          const mine = response?.filter(el => el?.email === currentUser?.email)
          const total = getSumByKey(mine, 'amount')
          setDeposits(mine)
          setTotalDeposits(total)
        })
  }, [currentUser]);

  useEffect(() => {
    allWithdrawals(1, 1000).then((response) => {
      // console.log("Withdrawals: ", {response})
      const mine = response?.filter(el => el?.email === currentUser?.email)
      const total = getSumByKey(mine, 'amount')
      // console.log({total})
      setWithdrawals(mine)
      setTotalWithdrawals(total)
      // setWithdrawals(response)
    })
  }, [currentUser]);

  // Get user details
  useEffect(() => {}, []);

  return (
    <>
      <HtmlHead title={title} description={description} />

      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">Welcome, {currentUser?.firstName}</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
        </Row>
      </div>
      {!fetching && <Row className="mb-4">
        <Col md={4} className="p-3 rounded-2" style={{ backgroundColor: '#242424' }}>
          <p className="text-white-50">Portfolio</p>
          <h1 className="text-white font-weight-bold mb-3">${Number(balance).toLocaleString()}</h1>
          {!fetching && (
            <div className="mb-4">
              <TickerTape colorTheme="light" />
            </div>
          )}
          <div className="mb-4">
            <AdvancedRealTimeChart theme="light" width="100%" height={300} symbol="BTCUSD" />
          </div>
        </Col>
        <Col md={8} className="p-3 rounded-2" style={{ backgroundColor: '#242424' }}>
          <Row className="mb-4">
            <Col md={6}>
              <Fincard title="TOTAL DEPOSIT" amount={Number(totalDeposits).toLocaleString()} />
            </Col>
            <Col md={6}>
              <Fincard title="TOTAL PROFIT" amount={Number(bonus).toLocaleString()} bgColor="#36b37e" />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col md={6}>
              <Fincard title="REFERRAL BONUS" amount={Number(capital).toLocaleString()} />
            </Col>
            <Col md={6}>
              <Fincard title="WITHDRAWALS" amount={Number(totalWithdrawals).toLocaleString()} bgColor="#36b37e" />
            </Col>
          </Row>
          <Row>
            <h2 className="text-white font-weight-bold">Auto Trading</h2>
            <p className="text-white-50">
              Earn profits by securely investing in stocks, crypto, REITs, ETFs and Bonds with our world-class auto-trading software.
            </p>
            <div className="w-100 rounded-2 p-4 text-center" style={{ fontSize: 18, borderColor: '#6a7e95', borderStyle: 'groove', borderWidth: 0.5 }}>
              <p className="text-white-50">
                {
                  investments?.length > 0 ? "View your investments":
                      "You do not have an active plan at the moment."
                }
              </p>
              <button onClick={
                investments?.length > 0? ()=>{window.location.href="/investments"}:
                    () => {window.location.href="/investments"}
              } className="btn btn-white rounded-2" type="button">
                {
                  investments?.length > 0? "View": "Invest in a plan"
                }
              </button>
            </div>
          </Row>
        </Col>
      </Row>}
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
      <Row className="justify-content-between mb-4">
        <Col md={6} className="p-3 rounded-2" style={{ backgroundColor: '#242424' }}>
          <h2 className="text-white font-weight-bold">Crypto</h2>
          <p className="text-white-50">
            Market cap ranking
          </p>

          <MarketOverview colorTheme="light" height={400} width="100%" showFloatingTooltip
            showChart={false} tabs={cryptoTabs}/>

        </Col>
        <Col md={6} className="p-3 rounded-2" style={{ backgroundColor: '#242424' }}>
          <h2 className="text-white font-weight-bold">DeFi</h2>
          <p className="text-white-50">
            Market cap ranking
          </p>

          <MarketOverview colorTheme="light" height={400} width="100%" showFloatingTooltip
                          showChart={false} tabs={defiTabs}/>
        </Col>

      </Row>
      <Row className="justify-content-between mb-4">
        <Col md={6} className="p-3 rounded-2" style={{ backgroundColor: '#242424' }}>
          <h2 className="text-white font-weight-bold mb-3">Market Overview</h2>

          <Screener colorTheme="light" height={400} width="100%"
                          market="america"/>

        </Col>
        <Col md={6} className="p-3 rounded-2" style={{ backgroundColor: '#242424' }}>
          <h2 className="text-white font-weight-bold mb-3">Market News</h2>

          <Timeline colorTheme="light" height={400} width="100%" showFloatingTooltip
                          market="anerica"/>
        </Col>

      </Row>
    </>
  );
};

export default DashboardsDefault;
