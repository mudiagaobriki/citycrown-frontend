import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Inject } from '@syncfusion/ej2-react-grids';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, LineSeries, DateTime, Legend, Tooltip } from '@syncfusion/ej2-react-charts';
import { allBookings } from '../../../services/bookingService';
import {allRoomTypes} from "../../../services/roomTypeService";
import {allRooms} from "../../../services/roomService"; // Assuming you have a service to fetch bookings

const BookingReportsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [bookingsTimeChartData, setBookingsTimeChartData] = useState([]);

    const fetchBookings = async () => {
        let response = await allBookings(1, 1000);
        console.log({ response });
        response = response.map(el => {
            return {
                adults: el?.adults,
                balance: el?.balance,
                bookingDate: new Date(el?.bookingDate).toLocaleDateString(),
                checkIn: new Date(el?.checkIn).toLocaleDateString(),
                checkOut: new Date(el?.checkOut).toLocaleDateString(),
                customer: `${el?.customer?.firstName  } ${  el?.customer?.lastName}`,
                expectedAmount: el?.expectedAmount,
                kids: el?.kids,
                paid: Number(el?.paid),
                paymentMode: el?.paymentMode,
                room: el?.room[0]?.name,
                roomType: el?.room[0]?.type,
                status: el?.status ?? "checked-in",
            }
        })
        console.log({response2: response, date1: new Date(response[0].bookingDate).toDateString()})
        setBookings(response);
        setFilteredBookings(response);

        let getRoomTypes = await allRoomTypes(1,1000);
        getRoomTypes = getRoomTypes.map(el => el?.name);
        setRoomTypes(getRoomTypes);

        const getRooms = await allRooms(1,1000);
        // getRooms = getRooms.map(el => el?.name);
        setRooms(getRooms);
    };

    useEffect(() => {
        fetchBookings().then(res => {
            console.log({ res });
        })
    }, []);

    // useEffect(() => {
    //     let rms
    //     console.log({ rms, rooms, selectedRoomType });
    //     if (selectedRoomType !== '') {
    //         rms = rooms.filter(el => el?.type === selectedRoomType);
    //     }
    //     console.log({ rms });
    //     setRooms(rms);
    // }, [selectedRoomType]);

    const filterBookings = (period, roomType, room, day) => {
        let filtered = bookings;
        console.log({ filtered });

        // Filter by period
        const today = new Date();
        switch (period) {
            case 'today':
                filtered = filtered.filter(booking => new Date(booking.bookingDate).toDateString() === today.toDateString());
                break;
            case 'thisWeek':
                // eslint-disable-next-line no-case-declarations
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                // eslint-disable-next-line no-case-declarations
                const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                filtered = filtered.filter(booking => new Date(booking.bookingDate) >= startOfWeek && new Date(booking.bookingDate) <= endOfWeek);
                break;
            case 'thisMonth':
                // eslint-disable-next-line no-case-declarations
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                // eslint-disable-next-line no-case-declarations
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                filtered = filtered.filter(booking => new Date(booking.bookingDate) >= startOfMonth && new Date(booking.bookingDate) <= endOfMonth);
                break;
            case 'thisQuarter':
                // eslint-disable-next-line no-case-declarations
                const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
                // eslint-disable-next-line no-case-declarations
                const startOfQuarter = new Date(today.getFullYear(), quarterStartMonth, 1);
                // eslint-disable-next-line no-case-declarations
                const endOfQuarter = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
                filtered = filtered.filter(booking => new Date(booking.bookingDate) >= startOfQuarter && new Date(booking.bookingDate) <= endOfQuarter);
                break;
            case 'lastSixMonths':
                // eslint-disable-next-line no-case-declarations
                const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
                filtered = filtered.filter(booking => new Date(booking.bookingDate) >= sixMonthsAgo);
                break;
            case 'thisYear':
                // eslint-disable-next-line no-case-declarations
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                // eslint-disable-next-line no-case-declarations
                const endOfYear = new Date(today.getFullYear(), 11, 31);
                filtered = filtered.filter(booking => new Date(booking.bookingDate) >= startOfYear && new Date(booking.bookingDate) <= endOfYear);
                break;
            default:
                break;
        }

        // Filter by room type
        if (roomType) {
            filtered = filtered.filter(booking => booking.roomType === roomType);
        }

        // Filter by room
        if (room) {
            // eslint-disable-next-line no-underscore-dangle
            filtered = filtered.filter(booking => booking.room === room);
        }

        // Filter by day of the week
        if (day) {
            filtered = filtered.filter(booking => new Date(booking.bookingDate).getDay() === parseInt(day, 10));
        }

        setFilteredBookings(filtered);

        const bookingsOverTimeData = filtered.reduce((acc, item) => {
            const date = item.bookingDate;
            if (!acc[date]) acc[date] = 0;
            // eslint-disable-next-line no-plusplus
            acc[date]++;
            return acc;
        }, {});
        
        console.log({ bookingsOverTimeData });

        setBookings(bookingsOverTimeData);

    };


    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        filterBookings(period, selectedRoomType, selectedRoom, selectedDay);
    };

    const handleRoomTypeChange = (roomType) => {
        setSelectedRoomType(roomType);
        filterBookings(selectedPeriod, roomType, selectedRoom, selectedDay);
    };

    const handleRoomChange = (room) => {
        setSelectedRoom(room);
        filterBookings(selectedPeriod, selectedRoomType, room, selectedDay);
    };

    const handleDayChange = (day) => {
        setSelectedDay(day);
        filterBookings(selectedPeriod, selectedRoomType, selectedRoom, day);
    };

    const CustomerNameTemplate = ({ customer }) => <p className="text-capitalize">{customer}</p>;

    const StatusTemplate = ({ status }) => <p className="text-capitalize">{status?.replace("-"," ")}</p>;

    return (
        <div className="p-4">
            <h2>Bookings Overview</h2>
            <Row className="mb-4">
                <Col>
                    <Form.Group>
                        <Form.Label>Select Period</Form.Label>
                        <Form.Control as="select" value={selectedPeriod} onChange={(e) => handlePeriodChange(e.target.value)}>
                            <option value="">All</option>
                            <option value="today">Today</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="thisQuarter">This Quarter</option>
                            <option value="lastSixMonths">Last Six Months</option>
                            <option value="thisYear">This Year</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Filter by Room Type</Form.Label>
                        <Form.Control as="select" value={selectedRoomType} onChange={(e) => handleRoomTypeChange(e.target.value)}>
                            <option value="">All</option>
                            {
                                roomTypes?.map((item, index) => (<option key={index} value={item}>{item}</option>))
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Filter by Room</Form.Label>
                        <Form.Control as="select" value={selectedRoom} onChange={(e) => handleRoomChange(e.target.value)}>
                            <option value="">All</option>
                            {
                                rooms?.map((item, index) => (<option key={index} value={item?.name}>{item?.name}</option>))
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Filter by Day of the Week</Form.Label>
                        <Form.Control as="select" value={selectedDay} onChange={(e) => handleDayChange(e.target.value)}>
                            <option value="">All</option>
                            <option value="0">Sunday</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h4>Bookings Grid</h4>
                            <GridComponent dataSource={filteredBookings} allowPaging allowSorting>
                                <ColumnsDirective>
                                    <ColumnDirective field="customer" headerText="Customer" width="150" template={CustomerNameTemplate} />
                                    <ColumnDirective field="room" headerText="Room" width="100" />
                                    <ColumnDirective field="checkIn" headerText="Check-In" width="100" />
                                    <ColumnDirective field="checkOut" headerText="Check-Out" width="100" />
                                    <ColumnDirective field="bookingDate" headerText="Booking Date" width="100" />
                                    <ColumnDirective field="status" headerText="Status" width="100" template={StatusTemplate} />
                                </ColumnsDirective>
                                <Inject services={[Page, Sort]} />
                            </GridComponent>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* <Row className="mt-4"> */}
            {/*    <Col> */}
            {/*        <Card> */}
            {/*            <Card.Body> */}
            {/*                <h4>Bookings Chart</h4> */}
            {/*                <ChartComponent id="charts" primaryXAxis={{ valueType: 'DateTime' }}> */}
            {/*                    <SeriesCollectionDirective> */}
            {/*                        <SeriesDirective dataSource={filteredBookings} xName="bookingDate" yName="adults" type="Line" /> */}
            {/*                    </SeriesCollectionDirective> */}
            {/*                    <Inject services={[LineSeries, DateTime, Legend, Tooltip]} /> */}
            {/*                </ChartComponent> */}
            {/*            </Card.Body> */}
            {/*        </Card> */}
            {/*    </Col> */}
            {/* </Row> */}
            {/* <Row className="mt-4" > */}
            {/*    <Col> */}
            {/*        <Card> */}
            {/*            <Card.Body> */}
            {/*                <h4>Bookings Chart 2</h4> */}
            {/*                /!* <BookingReportsPage dataSource={bookingsTimeChartData} allowPaging allowSorting /> *!/ */}
            {/*            </Card.Body> */}
            {/*        </Card> */}
            {/*    </Col> */}
            {/* </Row> */}
        </div>
    );
};

export default BookingReportsPage;