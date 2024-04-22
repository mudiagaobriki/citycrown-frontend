import React from 'react';
import {Card, Col, Row} from "react-bootstrap";
import room from "../../assets/rooms/room-1.jpg"

const RoomItem = ({ name, price, src, selected, onSelected=() => console.log("Selected"), type='Standard', width="100%", height=100}) => {
    return (
        <div className='rounded-2' onClick={onSelected}>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={src} style={{cursor: 'pointer', width, height}} />
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title><span className="font-weight-bold">Room {name}</span> ({type})</Card.Title>
                            <Card.Text>
                                &#8358;{price?.toLocaleString()}
                            </Card.Text>
                        </Col>
                        <Col className="align-self-end text-center">
                            <input checked={selected} type="checkbox" onChange={onSelected} className="form-checkbox"/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RoomItem;