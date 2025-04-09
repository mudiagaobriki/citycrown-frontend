import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Sort,
    Filter,
    Edit,
    Inject,
} from '@syncfusion/ej2-react-grids';
import { allStores, editStore } from '../../../services/storeService';
import {API_URL} from "../../../assets/constants";

const StoreInventory = () => {
    const [storeItems, setStoreItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [quantityChange, setQuantityChange] = useState(0);
    const [actionType, setActionType] = useState('');

    const fetchStoreItems = async () => {
        try {
            const response = await allStores(1, 1000);
            setStoreItems(response);
            setFilteredItems(response); // Initialize filtered items with full list
        } catch (error) {
            toast.error('Failed to fetch store items');
        }
    };

    useEffect(() => {
        fetchStoreItems();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredItems(
            storeItems.filter((item) => item.name.toLowerCase().includes(value))
        );
    };

    const handleAction = (item, type) => {
        setSelectedItem(item);
        setActionType(type);
        setQuantityChange(0);
        setShowModal(true);
    };

    const updateQuantity = async () => {
        if (quantityChange < 0) {
            toast.error('Quantity cannot be negative');
            return;
        }

        const newQuantity =
            actionType === 'spend'
                ? Math.max(0, selectedItem.quantity - quantityChange)
                : selectedItem.quantity + quantityChange;

        try {
            // Update item quantity
            await editStore(selectedItem.name, { quantity: newQuantity });

            // Log the transaction
            await fetch(`${API_URL}/items/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // eslint-disable-next-line no-underscore-dangle
                    itemName: selectedItem._id,
                    quantityChanged: quantityChange,
                    pricePerUnit: actionType === 'spend' ? selectedItem.salePrice : selectedItem.costPrice,
                    actionType: actionType === 'spend' ? 'use': 'restock',
                }),
            });

            toast.success(`Item ${actionType === 'spend' ? 'spent' : 'restocked'} successfully`);
            fetchStoreItems();
            setShowModal(false);
        } catch (error) {
            toast.error('Error updating item quantity');
        }
    };


    return (
        <>
            <div className="page-title-container mb-4">
                <Row>
                    <Col md="7">
                        <h1>Store Inventory</h1>
                    </Col>
                </Row>
            </div>

            {/* Search Box */}
            <Row className="mb-3">
                <Col md="4">
                    <Form.Control
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <GridComponent dataSource={filteredItems} allowPaging allowSorting pageSettings={{ pageSize: 10 }}>
                        <ColumnsDirective>
                            <ColumnDirective field="name" headerText="Name" width="150" textAlign="Left" />
                            <ColumnDirective field="costPrice" headerText="Cost Price" width="100" textAlign="Right" />
                            <ColumnDirective field="salePrice" headerText="Sale Price" width="100" textAlign="Right" />
                            <ColumnDirective field="quantity" headerText="Quantity" width="100" textAlign="Right" />
                            <ColumnDirective
                                headerText="Actions"
                                width="200"
                                template={(rowData) => (
                                    <>
                                        <Button variant="danger" size="sm" onClick={() => handleAction(rowData, 'spend')}>
                                            Spend
                                        </Button>{' '}
                                        <Button variant="success" size="sm" onClick={() => handleAction(rowData, 'restock')}>
                                            Restock
                                        </Button>
                                    </>
                                )}
                            />
                        </ColumnsDirective>
                        <Inject services={[Page, Sort, Filter, Edit]} />
                    </GridComponent>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{actionType === 'spend' ? 'Spend Item' : 'Restock Item'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Item:</strong> {selectedItem?.name}
                    </p>
                    <p>
                        <strong>Current Quantity:</strong> {selectedItem?.quantity}
                    </p>
                    <Form.Group>
                        <Form.Label>Quantity to {actionType}</Form.Label>
                        <Form.Control
                            type="number"
                            value={quantityChange}
                            min="0"
                            onChange={(e) => setQuantityChange(parseInt(e.target.value, 10))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateQuantity}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default StoreInventory;
