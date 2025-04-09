import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Sort,
    Filter,
    Inject,
} from "@syncfusion/ej2-react-grids";
import { Button, Modal, Form, Tab, Tabs } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import {allFacilities, editFacility} from "../../../services/facilityService";
import { newFacilityBookings } from "../../../services/facilityBookingsService";

const FacilityBookingPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState("unbooked");
    const [bookingForm, setBookingForm] = useState({
        facility: "",
        bookedBy: "",
        startDate: "",
        endDate: "",
        guests: 1,
        depositAmount: 0,
        balanceAmount: 0,
        status: "pending",
    });
    const [alert, setAlert] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFacilityId, setSelectedFacilityId] = useState("");

    // Syncfusion Grid settings
    const pageSettings = { pageSize: 10 };
    const sortSettings = { columns: [{ field: "name", direction: "Ascending" }] };

    // Fetch all facilities
    const fetchFacilities = async () => {
        setLoading(true);
        try {
            allFacilities(1, 1000).then((res) => {
                setFacilities(res);
            });
        } catch (error) {
            console.error("Error fetching facilities:", error);
        }
        setLoading(false);
    };

    // Filter facilities based on selected tab and search query
    const filteredFacilities = facilities.filter(facility => {
        const isBooked = facility.isAvailable === false;
        const isSearchMatch = facility?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            facility?.bookedBy?.toLowerCase()?.includes(searchQuery.toLowerCase());

        return selectedTab === "unbooked" ? !isBooked && isSearchMatch : isBooked && isSearchMatch;
    });

    // Show alert message
    const showAlert = (message, type) => {
        setAlert(
            <SweetAlert
                success={type === "success"}
                danger={type === "danger"}
                title={type === "success" ? "Success!" : "Error!"}
                onConfirm={() => setAlert(null)}
            >
                {message}
            </SweetAlert>
        );
    };

    // Handle booking form submission
    const handleBookingFormSubmit = async () => {
        try {
            const response = await newFacilityBookings(bookingForm);
            const response2 = await editFacility(selectedFacilityId,{isAvailable:false});
            showAlert("Facility booked successfully!", "success");
            setShowModal(false);
            setBookingForm({
                facility: "",
                bookedBy: "",
                startDate: "",
                endDate: "",
                guests: 1,
                depositAmount: 0,
                balanceAmount: 0,
                status: "pending",
            });
        } catch (error) {
            showAlert("Error booking facility. Please try again.", "danger");
            console.error("Error booking facility:", error);
        }
    };

    // Handle unbooking (releasing) a facility
    const handleReleaseFacility = async (facilityId) => {
        // console.log("Clicked")
        try {
            const response2 = await editFacility(facilityId,{isAvailable:true});
            showAlert("Facility released successfully!", "success");
            fetchFacilities(); // Refresh the list
        } catch (error) {
            showAlert("Error releasing facility. Please try again.", "danger");
            console.error("Error releasing facility:", error);
        }
    };

    // Fetch facilities on component load
    useEffect(() => {
        fetchFacilities();
    }, []);

    // Modal for facility booking
    const handleShowModal = (facilityId) => {
        setSelectedFacilityId(facilityId)
        setBookingForm((prev) => ({ ...prev, facility: facilityId }));
        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Facility Management</h1>

            {/* Alert */}
            {alert}

            {/* Search Bar */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by property name or booked by"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Tabs for Booked and Unbooked Properties */}
            <Tabs
                activeKey={selectedTab}
                onSelect={(k) => setSelectedTab(k)}
                id="facility-booking-tabs"
                className="mb-3"
            >
                <Tab eventKey="unbooked" title="Unbooked Properties">
                    {/* Syncfusion Grid for unbooked properties */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <GridComponent
                            dataSource={filteredFacilities}
                            allowPaging
                            pageSettings={pageSettings}
                            allowSorting
                            sortSettings={sortSettings}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="name" headerText="Name" width="150" />
                                <ColumnDirective field="description" headerText="Description" width="200" />
                                <ColumnDirective
                                    field="bookingPrice"
                                    headerText="Booking Price"
                                    width="150"
                                    textAlign="Right"
                                />
                                <ColumnDirective
                                    field="images"
                                    headerText="Images"
                                    width="150"
                                    template={(props) => (
                                        <img
                                            src={props.images}
                                            alt="Facility"
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    )}
                                />
                                <ColumnDirective
                                    headerText="Actions"
                                    width="150"
                                    template={(props) => (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            // eslint-disable-next-line no-underscore-dangle
                                            onClick={() => handleShowModal(props._id)}
                                        >
                                            Book Facility
                                        </Button>
                                    )}
                                />
                            </ColumnsDirective>
                            <Inject services={[Page, Sort, Filter]} />
                        </GridComponent>
                    )}
                </Tab>
                <Tab eventKey="booked" title="Booked Properties">
                    {/* Syncfusion Grid for booked properties */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <GridComponent
                            dataSource={filteredFacilities}
                            allowPaging
                            pageSettings={pageSettings}
                            allowSorting
                            sortSettings={sortSettings}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="name" headerText="Name" width="150" />
                                <ColumnDirective field="description" headerText="Description" width="200" />
                                <ColumnDirective
                                    field="bookingPrice"
                                    headerText="Booking Price"
                                    width="150"
                                    textAlign="Right"
                                />
                                <ColumnDirective
                                    field="images"
                                    headerText="Images"
                                    width="150"
                                    template={(props) => (
                                        <img
                                            src={props.images}
                                            alt="Facility"
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    )}
                                />
                                <ColumnDirective
                                    headerText="Actions"
                                    width="150"
                                    template={(props) => (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            // eslint-disable-next-line no-underscore-dangle
                                            onClick={() => handleReleaseFacility(props._id)}
                                        >
                                            Release Facility
                                        </Button>
                                    )}
                                />
                            </ColumnsDirective>
                            <Inject services={[Page, Sort, Filter]} />
                        </GridComponent>
                    )}
                </Tab>
            </Tabs>

            {/* Booking Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Book Facility</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Booked By</Form.Label>
                            <Form.Control
                                type="text"
                                value={bookingForm.bookedBy}
                                onChange={(e) =>
                                    setBookingForm({ ...bookingForm, bookedBy: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={bookingForm.startDate}
                                onChange={(e) =>
                                    setBookingForm({ ...bookingForm, startDate: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={bookingForm.endDate}
                                onChange={(e) =>
                                    setBookingForm({ ...bookingForm, endDate: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Guests</Form.Label>
                            <Form.Control
                                type="number"
                                value={bookingForm.guests}
                                onChange={(e) =>
                                    setBookingForm({ ...bookingForm, guests: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Deposit Amount</Form.Label>
                            <Form.Control
                                type="number"
                                value={bookingForm.depositAmount}
                                onChange={(e) =>
                                    setBookingForm({ ...bookingForm, depositAmount: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Balance Amount</Form.Label>
                            <Form.Control
                                type="number"
                                value={bookingForm.balanceAmount}
                                onChange={(e) =>
                                    setBookingForm({ ...bookingForm, balanceAmount: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleBookingFormSubmit}>
                        Book Facility
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FacilityBookingPage;
