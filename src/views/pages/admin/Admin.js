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

const Admin = () => {
    const title = 'Admin';
    const description = 'Truma BTC Limited';

    const breadcrumbs = [
        { to: '', text: 'City Crown Hotels' },
    ];
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
    const [withdrawalMethod, setWithdrawalMethod] = useState("coin");
    const [coin, setCoin] = useState("");
    const [amount, setAmount] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumer] = useState("");
    const [accountName, setAccountName] = useState("");
    const [swiftCode, setSwiftCode] = useState("");
    const [routingNumber, setRoutingNumber] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [selectedClient, setSelectedClient] = useState({});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [balance, setBalance] = useState("");
    const [capital, setCapital] = useState("");
    const [bonus, setBonus] = useState("");
    const [onUpgrade, setOnUpgrade] = useState("");
    const [country, setCountry] = useState("");
    const [clientType, setClientType] = useState("");
    const [withdrawals, setWithdrawals] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [showWithdrawals, setShowWithdrawals] = useState(false);
    const [showDeposits, setShowDeposits] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleWithdrawalMethod = (e) => {
        setWithdrawalMethod(e.target.value)
    }

    useEffect(() => {
        // console.log("In Use Effect")
        fetch(`https://indabosky.stock-standard.com/api/all-users/1/1000`)
            .then(response => response.json())
            .then(response => {
                setAllUsers(response?.data?.docs)
                // console.log("Response: ", {response})
            })
            .catch(err => {
                toast.error(err.toString())
            })
    },[])

    useEffect(() => {
        // console.log("In Use Effect")
        fetch(`https://indabosky.stock-standard.com/api/withdrawals/all/1/1000`)
            .then(response => response.json())
            .then(response => {
                setWithdrawals(response?.data?.docs)
                // console.log("Withdrawals: ", {response})
            })
            .catch(err => {
                toast.error("Error fetching withdrawals.")
            })
    },[])

    useEffect(() => {
        // console.log("In Use Effect")
        fetch(`https://indabosky.stock-standard.com/api/deposit/all/1/1000`)
            .then(response => response.json())
            .then(response => {
                setDeposits(response?.data?.docs)
                // console.log("Deposits: ", {response})
            })
            .catch(err => {
                toast.error("Error fetching deposits.")
            })
    },[])

    const handleSubmitRequest = async () => {
        if (withdrawalMethod === "coin"){
            const payload = {
                method: 'Coin',
                coin,
                amount,
                walletAddress,
                email: JSON.parse(localStorage?.getItem("currentUser")).email,
                date: new Date(),
            }

            // console.log({payload})

            try {
                const response = await fetch("https://indabosky.stock-standard.com/api/loans/new", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                // console.log("Result:", result);
                toast.success("Withdrawal request sent successfully")
                setTimeout(() => window.location.reload(), 3000)
                // window.location.reload()

            } catch (error) {
                console.error("Error:", error);
                toast.error(error.toString());
            }
        }
        else{
            const payload = {
                method: 'bank',
                bankName,
                accountName,
                accountNumber,
                swiftCode,
                routingNumber,
                city,
                zipCode,
                bonus,
                amount,
                email: JSON.parse(localStorage?.getItem("currentUser")).email,
                date: new Date(),
            }

            // console.log({payload})

            try {
                // console.log("Got here")
                const response = await fetch("https://indabosky.stock-standard.com/api/loans/new", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                // console.log("Result:", result);
                toast.success("Withdrawal request sent successfully")
                setTimeout(() => window.location.reload(), 3000)
                // window.location.reload()

            } catch (error) {
                console.error("Error:", error);
                toast.error(error.toString());
            }
        }
    }

    const handleUpdateBasicInfo = async () => {
        setLoading(true)
        const payload = {
            firstName,
            lastName,
            country,
            email: clientEmail,
            balance,
            capital,
            bonus,
            onUpgrade,
            type: clientType
        }

        const payload2 = {
            balance,
            capital,
            bonus,
            accountType: clientType,
        }

        // // console.log({payload})
        try {
            const response = await fetch("https://indabosky.stock-standard.com/api/edit-user", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: clientEmail, payload
                }),
            });

            const response2 = await fetch("https://indabosky.stock-standard.com/api/accounts/edit-account", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: clientEmail, payload: payload2
                }),
            });

            // const result = await response.json();
            // const result2 = await response2.json();
            // // console.log("Result:", result);
            // console.log("Result2:", result2);
            setLoading(false)
            toast.success("Client profile has been updated successfully.")
            setTimeout(() => {window.location.reload()}, 3000)
            // window.location.reload()

        } catch (error) {
            // console.error("Error:", error);
            toast.error(error.toString());
            setLoading(false)
        }
    }

    // const handleUpdateContactInfo = async () => {
    //     const payload = { phone }
    //
    //     console.log({payload})
    //
    //     try {
    //         const response = await fetch("https://indabosky.stock-standard.com/api/edit-user", {
    //             method: "POST", // or 'PUT'
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 email, payload
    //             }),
    //         });
    //
    //         const result = await response.json();
    //         console.log("Result:", result);
    //         toast.success("Your profile has been updated successfully. Login again to continue.")
    //         setTimeout(() => {window.location.href="/login"}, 3000)
    //         // window.location.reload()
    //
    //     } catch (error) {
    //         console.error("Error:", error);
    //         toast.error(error.toString());
    //     }
    // }

    // const handleUpdatePassword = () => {
    //     const payload = { password }
    //
    //     if (password !== confirmPassword) {
    //         alert("Password and confirm password do not match")
    //         return
    //     }
    //
    //     console.log({password})
    // }

    const upgradeOptions = [
        { value: 'active', label: 'Active' },
        { value: 'upgrade', label: 'Upgrade' },
    ];

    const selectUser = (selected) => {
        const item = allUsers?.find(el => el?.email === selected)
        setSelectedClient(item)
        setBalance(item?.balance)
        setClientType(item?.type)
        setFirstName(item?.firstName)
        setLastName(item?.lastName)
        setCountry(item?.country)
        setClientEmail(item?.email)
        setClientPhone(item?.phone)
        setBonus(item?.bonus ?? '0')
        setCapital(item?.capital)
        setOnUpgrade(item?.onUpgrade)
        setWithdrawals(withdrawals?.filter(el => el?.email === selected))
        setShowWithdrawals(true)
        setShowDeposits(true)
        // console.log("Selected Client: ", item)
    }

    const approveWithdrawal = async (id) => {
        // console.log({email, method})
        console.log({id})
        const payload = { status: 'approved' }

        try {
            const response = await fetch("https://indabosky.stock-standard.com/api/withdrawal/edit", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id, payload,}),
            });

            const result = await response.json();
            console.log("Result:", result);
            toast.success("Withdrawal request updated successfully")
            setTimeout(() => window.location.reload(), 3000)
            // window.location.reload()

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.toString());
        }
    }

    const approveDeposit = async (id) => {
        // console.log({email, method})
        console.log({id})
        const payload = { status: 'approved' }

        try {
            const response = await fetch("https://indabosky.stock-standard.com/api/deposit/edit", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id, payload,}),
            });

            const result = await response.json();
            console.log("Result:", result);
            toast.success("Deposit request updated successfully")
            // setTimeout(() => window.location.reload(), 3000)
            // window.location.reload()

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.toString());
        }
    }

    const declineWithdrawal = async (id) => {
        const payload = { status: 'declined' }

        try {
            const response = await fetch("https://indabosky.stock-standard.com/api/withdrawal/edit", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id, payload}),
            });

            const result = await response.json();
            console.log("Result:", result);
            toast.success("Withdrawal request updated successfully")
            setTimeout(() => window.location.reload(), 3000)
            // window.location.reload()

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.toString());
        }
    }

    const declineDeposit = async (id) => {
        const payload = { status: 'declined' }

        try {
            const response = await fetch("https://indabosky.stock-standard.com/api/deposit/edit", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id, payload}),
            });

            const result = await response.json();
            console.log("Result:", result);
            toast.success("Deposit request updated successfully")
            setTimeout(() => window.location.reload(), 3000)
            // window.location.reload()

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.toString());
        }
    }

    const deleteUser = async (userEmail) => {
        // console.log({u})
        // eslint-disable-next-line no-restricted-globals
        const t = confirm(`Are you sure you want to delete ${  userEmail}`)
        if (!t) return


        try {
            const response = await fetch(`https://indabosky.stock-standard.com/api/delete-user`, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: userEmail}),
            });

            const result = await response.json();
            console.log("Result:", result);
            toast.success("User deleted successfully")
            setTimeout(() => window.location.reload(), 3000)
            // window.location.reload()

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.toString());
        }
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

                    <Row>
                        <Col md={6}>
                            <h2 className="small-title">Withdrawal History</h2>
                            <Card className="mb-5">
                                <Card.Body>
                                    <Table responsive striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            allUsers.map((item, index) => {
                                                return <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td style={{textTransform: 'capitalize'}}>{item?.firstName}</td>
                                                    <td style={{textTransform: 'capitalize'}}>{item?.lastName}</td>
                                                    <td style={{textTransform: 'none'}}>{item?.email}</td>
                                                    <td style={{textTransform: 'capitalize'}}>
                                                        <Button onClick={() => selectUser(item?.email)} className="btn btn-primary btn-small me-2 mb-2">
                                                            Select
                                                        </Button>
                                                        <Button onClick={() => deleteUser(item?.email)} className="btn btn-danger btn-small mb-2">
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <h2 className="small-title">Basic Info</h2>
                            <Card className="mb-5">
                                <Card.Body>
                                    <Form>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">First Name</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control onChange={(e) => setFirstName(e.target.value)} type="text" defaultValue={firstName} />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Last Name</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control onChange={(e) => setLastName(e.target.value)} type="text" defaultValue={lastName} />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Country</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={country} onChange={(e) => setCountry(e.target.value)}  />
                                            </Col>
                                        </Row>


                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Email</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="email" defaultValue={clientEmail} disabled />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Phone</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={clientPhone} disabled />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Portfolio</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={balance} onChange={(e) => setBalance(e.target.value)}  />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Referral Bonus</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={capital} onChange={(e) => setCapital(e.target.value)}  />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Profit</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Control type="text" defaultValue={bonus} onChange={(e) => setBonus(e.target.value)}  />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Account Type</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Select defaultValue={clientType} onChange={(e) => setClientType(e.target.value)} aria-label="Default select example">
                                                    <option>Select user's account type</option>
                                                    <option selected={clientType === "basic"}  value="basic">Basic</option>
                                                    <option selected={clientType === "bronze"} value="bronze">Bronze</option>
                                                    <option selected={clientType === "silver"} value="silver">Silver</option>
                                                    <option selected={clientType === "gold"} value="gold">Gold</option>
                                                    <option value="platinum">Platinum</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg="2" md="3" sm="4">
                                                <Form.Label className="col-form-label">Upgrade</Form.Label>
                                            </Col>
                                            <Col sm="8" md="9" lg="10">
                                                <Form.Select defaultValue={onUpgrade} onChange={(e) => setOnUpgrade(e.target.value)} aria-label="Default select example">
                                                    <option>Select upgrade status</option>
                                                    <option selected={onUpgrade === "active"}  value="active">Active</option>
                                                    <option selected={onUpgrade === "upgrade"}  value="upgrade">Upgrade</option>
                                                </Form.Select>
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

                            {showWithdrawals && <>
                                <h2 className="small-title">Withdrawals</h2>
                                <Card className="mb-5">
                                    <Card.Body>
                                        <Table responsive striped bordered hover>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Method</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                withdrawals.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{item?.method}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{item?.amount}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{new Date(item?.date).toDateString()}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{item?.status}</td>
                                                        <td style={{textTransform: 'capitalize'}}>
                                                            {/* eslint-disable-next-line no-underscore-dangle */}
                                                            <Button onClick={() => approveWithdrawal(item?._id)} className="btn btn-success btn-small me-1 mb-2">
                                                                Approve
                                                            </Button>
                                                            {/* eslint-disable-next-line no-underscore-dangle */}
                                                            <Button onClick={() => declineWithdrawal(item?._id)} className="btn btn-danger btn-small">
                                                                Decline
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </>}
                            {showDeposits && <>
                                <h2 className="small-title">Deposits</h2>
                                <Card className="mb-5">
                                    <Card.Body>
                                        <Table responsive striped bordered hover>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Method</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                deposits.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{item?.method}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{item?.amount}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{new Date(item?.date).toDateString()}</td>
                                                        <td style={{textTransform: 'capitalize'}}>{item?.status}</td>
                                                        <td style={{textTransform: 'capitalize'}}>
                                                            {/* eslint-disable-next-line no-underscore-dangle */}
                                                            <Button onClick={() => approveDeposit(item?._id)} className="btn btn-success btn-small me-1 mb-2">
                                                                Approve
                                                            </Button>
                                                            {/* eslint-disable-next-line no-underscore-dangle */}
                                                            <Button onClick={() => declineDeposit(item?._id)} className="btn btn-danger btn-small">
                                                                Decline
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </>}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Admin;
