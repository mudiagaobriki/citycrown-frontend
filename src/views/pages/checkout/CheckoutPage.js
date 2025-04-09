import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Tab, Tabs } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import { allBookings, editBooking } from '../../../services/bookingService';

const CheckoutPage = () => {
    const [bookings, setBookings] = useState([]);
    const [tabInView, setTabInView] = useState('checked-in');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [filter, setFilter] = useState('');

    const history = useHistory();

    // Fetch bookings based on the current tab and filter
    const fetchBookings = () => {
        allBookings(1,1000).then((res) => {
            console.log({ res });
            let filteredBookings = res;
            if (tabInView === 'checked-in') {
                filteredBookings = filteredBookings.filter((booking) => (booking.status === 'checked-in' || booking.status === undefined));
            } else if (tabInView === 'checked-out') {
                filteredBookings = filteredBookings.filter((booking) => booking.status === 'checked-out');
            }
            if (filter) {
                filteredBookings = filteredBookings.filter((booking) =>
                    (
                        booking.customer?.firstName?.toLowerCase().includes(filter.toLowerCase()) ||
                        booking.customer?.lastName?.toLowerCase().includes(filter.toLowerCase()) ||
                        booking.customer?.otherNames?.toLowerCase().includes(filter.toLowerCase()) ||
                        booking.room[0]?.name?.toLowerCase().includes(filter.toLowerCase())
                    )
                );
            }
            
            console.log({ filteredBookings, filter });
            setBookings(filteredBookings);
        });
    };

    useEffect(() => {
        fetchBookings();
    }, [tabInView, filter]);

    // Handle checking out a booking
    const handleCheckout = (id) => {
        const payload = { status: 'checked-out' };
        // console.log({payload});
        editBooking( id, payload ).then((res) => {
            if (res.status === 'success') {
                setAlertMessage('Booking successfully checked out!');
                setShowAlert(true);
                fetchBookings();
            } else {
                setAlertMessage('Failed to check out booking.');
                setShowAlert(true);
            }
        });
    };

    return (
        <div>
            <Row className="mb-4">
                <Col md="6">
                    <h1 className="display-4">Checkout</h1>
                </Col>
                <Col md="6" className="text-end">
                    <Form.Control
                        type="text"
                        placeholder="Search by customer name"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </Col>
            </Row>

            <Tabs
                activeKey={tabInView}
                onSelect={(tab) => setTabInView(tab)}
                className="mb-4"
            >
                <Tab eventKey="checked-in" title="Checked In">
                    <Row>
                        {bookings.map((booking) => (
                            // eslint-disable-next-line no-underscore-dangle
                            <Col md="4" key={booking._id} className="mb-4">
                                <div className="p-3 border rounded">
                                    <h5 className="text-capitalize">{`${booking.customer?.firstName} ${booking.customer?.lastName} ${booking.customer?.otherNames ?? ""}`}</h5>
                                    <p className="text-capitalize"><strong>Room:</strong> {booking.room[0]?.name}</p>
                                    <p><strong>Check-In:</strong> {booking.checkIn}</p>
                                    <p><strong>Check-Out:</strong> {booking.checkOut}</p>
                                    <p><strong>Status:</strong> {booking.status}</p>
                                    <p><strong>Balance:</strong> {booking.balance}</p>
                                    <Button
                                        variant="success"
                                        // eslint-disable-next-line no-underscore-dangle
                                        onClick={() => handleCheckout(booking._id)}
                                    >
                                        Check Out
                                    </Button>
                                    {/* <Button */}
                                    {/*    variant="link" */}
                                    {/*    className="ms-2" */}
                                    {/*    // eslint-disable-next-line no-underscore-dangle */}
                                    {/*    onClick={() => history.push(`/bookings/edit?id=${booking._id}`)} */}
                                    {/* > */}
                                    {/*    Edit Booking */}
                                    {/* </Button> */}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="checked-out" title="Checked Out">
                    <Row>
                        {bookings.map((booking) => (
                            // eslint-disable-next-line no-underscore-dangle
                            <Col md="4" key={booking._id} className="mb-4">
                                <div className="p-3 border rounded">
                                    <h5 className="text-capitalize">{`${booking.customer?.firstName} ${booking.customer?.lastName} ${booking.customer?.otherNames ?? ""}`}</h5>
                                    <p className="text-capitalize"><strong>Room:</strong> {booking.room[0]?.name}</p>
                                    <p><strong>Check-In:</strong> {booking.checkIn}</p>
                                    <p><strong>Check-Out:</strong> {booking.checkOut}</p>
                                    <p><strong>Status:</strong> {booking.status}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>

            {showAlert && (
                <SweetAlert
                    success={alertMessage.includes('successfully')}
                    danger={!alertMessage.includes('successfully')}
                    title={alertMessage}
                    onConfirm={() => setShowAlert(false)}
                />
            )}
        </div>
    );
};

export default CheckoutPage;
