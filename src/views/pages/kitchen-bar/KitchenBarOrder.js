import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import 'intro.js/introjs.css';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { toast } from 'react-toastify';
import axios from 'axios';

const KitchenBarOrder = () => {
    const title = 'Make an Order';
    const description = 'Create a new kitchen or bar order';

    const [presets, setPresets] = useState([]);
    const [formData, setFormData] = useState({
        selectedPresets: [],
        quantities: {},
        orderSource: 'kitchen', // Default order source is kitchen
    });

    const breadcrumbs = [
        { to: '', text: 'Kitchen and Bar' },
        { to: 'orders', text: 'New Order' },
    ];

    useEffect(() => {
        // Fetch presets
        axios
            .get('http://localhost:3040/api/kitchen-bar-presets/all/1/1000')
            .then((response) => {
                if (response.data.status === 'success') {
                    setPresets(response.data.data.docs);
                } else {
                    toast.error('Failed to load presets.');
                }
            })
            .catch((error) => {
                console.error('Error fetching presets:', error);
                toast.error('Failed to load presets.');
            });
    }, []);

    const handlePresetChange = (event) => {
        setFormData({ ...formData, selectedPresets: event.value });
    };

    const handleQuantityChange = (presetId, quantity) => {
        setFormData((prev) => ({
            ...prev,
            quantities: { ...prev.quantities, [presetId]: quantity },
        }));
    };

    const handleOrderSourceChange = (event) => {
        setFormData({ ...formData, orderSource: event.target.value });
    };

    const handleOrderSubmit = () => {
        // Validate required fields before submission
        if (formData.selectedPresets.length === 0) {
            toast.error('Please select at least one preset.');
            return;
        }

        // Map order items to match backend expectations
        const orderItems = formData.selectedPresets.map((presetId) => {
            // eslint-disable-next-line no-underscore-dangle
            const preset = presets.find((p) => p._id === presetId); // Find preset details
            return {
                // eslint-disable-next-line no-underscore-dangle
                Id: preset._id, // Backend expects `Id`
                name: preset.name,
                price: parseFloat(preset.price), // Ensure price is a number
                // eslint-disable-next-line no-underscore-dangle
                quantity: formData.quantities[preset._id] || 1, // Default to 1 if no quantity is specified
            };
        });

        const payload = {
            customer: {
                Id: '12345', // Example customer ID; replace with actual data
                name: 'John Doe', // Example customer name
                contactNumber: '123-456-7890', // Example contact number
                roomNumber: '101', // Example room number
            },
            orderDetails: {
                orderSource: formData.orderSource, // Set based on user selection
                totalAmount: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                comments: '', // Optional comments field
            },
            orderItems,
        };

        axios
            .post('http://localhost:3040/api/kitchen-bar-order/new', payload)
            .then(() => {
                toast.success('Order placed successfully!');
                setFormData({ selectedPresets: [], quantities: {}, orderSource: 'kitchen' });
            })
            .catch((error) => {
                console.error('Error placing order:', error);
                toast.error('Failed to place order.');
            });
    };

    return (
        <>
            <HtmlHead title={title} description={description} />

            {/* Title and Breadcrumbs */}
            <div className="page-title-container mb-7">
                <Row>
                    <Col md="7">
                        <h1 className="mb-0 pb-0 display-4">{title}</h1>
                        <BreadcrumbList items={breadcrumbs} />
                    </Col>
                </Row>
            </div>

            {/* Order Form */}
            <Card className="p-4">
                <Row className="mb-4">
                    <Col>
                        <label htmlFor="orderSource">Select Order Source</label>
                        <Form.Control
                            as="select"
                            id="orderSource"
                            value={formData.orderSource}
                            onChange={handleOrderSourceChange}
                        >
                            <option value="kitchen">Kitchen</option>
                            <option value="bar">Bar</option>
                            <option value="pool">Pool</option>
                        </Form.Control>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <label htmlFor="presets">Select Presets</label>
                        <MultiSelectComponent
                            id="presets"
                            dataSource={presets}
                            fields={{ text: 'name', value: '_id' }}
                            placeholder="Choose presets"
                            value={formData.selectedPresets}
                            change={handlePresetChange}
                        />
                    </Col>
                </Row>

                {formData.selectedPresets.map((presetId) => {
                    // eslint-disable-next-line no-underscore-dangle
                    const preset = presets.find((p) => p._id === presetId);
                    return (
                        <Row key={presetId} className="mb-3 align-items-center">
                            <Col md={6}>
                                <span>{preset.name}</span>
                            </Col>
                            <Col md={6}>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Quantity"
                                    value={formData.quantities[presetId] || ''}
                                    onChange={(e) =>
                                        handleQuantityChange(presetId, parseInt(e.target.value, 10))
                                    }
                                />
                            </Col>
                        </Row>
                    );
                })}

                <Row className="mt-4">
                    <Col md={{ span: 2, offset: 5 }}>
                        <Button className="btn btn-primary w-100" onClick={handleOrderSubmit}>
                            Place Order
                        </Button>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default KitchenBarOrder;
