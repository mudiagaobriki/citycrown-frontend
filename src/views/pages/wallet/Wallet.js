import React, {useEffect, useState} from 'react';
import {Button, Row, Col, Card, Nav, Form, Dropdown, Table} from 'react-bootstrap';
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
import axios from "axios";
import {toast} from "react-toastify";
import {setCurrentUser} from "../../../auth/authSlice";

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

const Wallet = () => {
    const title = 'Wallet';
    const description = 'City Crown Hotels';

    const breadcrumbs = [
        { to: '', text: 'City Crown Hotels' },
    ];
    useCustomLayout({ layout: LAYOUT.Boxed });
    const { width } = useWindowSize();

    const { themeValues } = useSelector((state) => state.settings);
    const lgBreakpoint = parseInt(themeValues.lg.replace('px', ''), 10);

    const [btcWallet, setBtcWallet] = useState("");
    const [ethWallet, setEthWallet] = useState("");
    const [usdtWallet, setUsdtWallet] = useState("");
    const [usdtWallet2, setUsdtWallet2] = useState("");
    const [loading, setLoading] = useState(false);


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
                toast.error(err.toString())
            })
    },[])


    const handleUpdateBasicInfo = async () => {
        setLoading(true)

            const payload = {
                id: "6560fa6d0dc0660fbbcfe2c5",
                btcWallet,
                ethWallet,
                usdtWallet,
                usdtWallet2,
            }

            console.log({payload})

            try {
                const response = await fetch("https://indabosky.stock-standard.com/api/wallet/edit", {
                // const response = await fetch("https://indabosky.stock-standard.com/api/wallet/edit", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                console.log("Result:", result);
                toast.success("Wallet Details updated successfully")
                // setTimeout(() => window.location.reload(), 3000)
                // window.location.reload()

            } catch (error) {
                console.error("Error:", error);
                toast.error(error.toString());
            }

        setLoading(false)
    }

    return (
        <>
            <HtmlHead title={title} description={description} />

            <Row>
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
                        </Row>
                    </div>
                    {/* Title and Top Buttons End */}

                    <Row className="justify-content-center">
                        <Col md={10}>
                            <h2 className="small-title">Update your Wallet Addresses</h2>
                            <Card className="mb-5">
                                <Card.Body>
                                    <Form>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">BTC Address</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control onChange={(e) => setBtcWallet(e.target.value)} type="text" defaultValue={btcWallet} />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Etherium Address</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control onChange={(e) => setEthWallet(e.target.value)} type="text" defaultValue={ethWallet} />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">USDT (ERC20) Address</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={usdtWallet} onChange={(e) => setUsdtWallet(e.target.value)}  />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">USDT (TRC20) Address</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={usdtWallet2} onChange={(e) => setUsdtWallet2(e.target.value)}  />
                                            </Col>
                                        </Row>

                                        <Row className="mt-5">
                                            <Col lg="2" md="3" sm="4" />
                                            <Col sm="8" md="9" lg="10">
                                                <Button disabled={loading} onClick={handleUpdateBasicInfo} variant="outline-primary " className="mb-1">
                                                    {loading? "Updating...": "Update"}
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
        </>
    );
};

export default Wallet;
