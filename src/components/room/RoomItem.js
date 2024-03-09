import React from 'react';
import {Card, Col, Row} from "react-bootstrap";
import room from "../../assets/rooms/room-1.jpg"

const RoomItem = ({ name, price, type='Standard', width=4, height=100}) => {
    return (
        <div className='rounded-2'>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={room} style={{cursor: 'pointer'}} />
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title><span className="font-weight-bold">Room {name}</span> ({type})</Card.Title>
                            <Card.Text>
                                &#8358;{price?.toLocaleString()}
                            </Card.Text>
                        </Col>
                        <Col className="align-self-end text-center">
                            <input type="checkbox" className="form-checkbox"/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RoomItem;