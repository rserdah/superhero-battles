import React, {useState} from 'react';
import { Button, Alert, Card, Form, Container, Row, Col } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterInput(props: any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    function handleSubmit(event: any) {
        event.preventDefault();
        props.registerUser(username, password)
    }
    function handleLogin(event: any) {
        event.preventDefault();
        props.loginUser(username, password)
    }

    return (
        <>
            <Col md={4}></Col>
            <Col md={4}>
                <Row>
                    {props.actionResult.message && (<Alert variant={props.actionResult.type}>{props.actionResult.message}</Alert>)}
                </Row>
                <Row>
                    <Col md={3}></Col>
                    <Col md={6}>
                        <Row className='mb-2'>
                            <Form.Control type='text' placeholder='username' onChange={(e) => setUsername(e.target.value)}></Form.Control>
                        </Row>
                        <Row>
                            <Form.Control type='text' placeholder='password' onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        </Row>
                        <Container>
                            <Row className='mt-3'>
                                <Col md={6}>
                                    <Button onClick={handleSubmit}>Register</Button>
                                </Col>
                                <Col md={1}>
                                    <Button onClick={handleLogin}>Login</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Col>
        </>
    );
}

export default RegisterInput