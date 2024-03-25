import React, { useEffect, useState } from 'react'
import RegisterInput from './LoginAndRegisterInput'
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../Redux/slices/userSlice';
import { Button, Alert, Card, Form, Container, Row, Col } from 'react-bootstrap';


const URL = `http://3.137.160.227:4000`;

function RegisterContainer() {
    const [actionMessage, setActionMessage] = useState('');
    const [actionResult, setActionResult] = useState({ type: '', message: '' });
    let dispatcher = useDispatch();
    const username = useSelector((state: any) => state.token.username);

    async function registerUser(username: any, password: any) {
        try {
            console.log("register");
            let response = await axios.post(`${URL}/register`, {
                username: username,
                password: password
            });

            setActionMessage(response.data.message);
            setActionResult({ type: 'success', message: response.data.message });

            return response;
        } catch (error) {
            console.error(error);
            
            try { setActionMessage((error as any).response.data.message); } catch(e) { setActionMessage('Error registering user'); }
            try { setActionResult({ type: 'danger', message: (error as any).response.data.message }); } catch(e) { setActionResult({ type: 'danger', message: 'Error registering user' }); }
        }
    }

    async function loginUser(username: any, password: any) {

        try {
            let response = await axios.post(`${URL}/login`, {
                username: username,
                password: password
            });

            if(response && response.status == 200 && response.data && response.data.token) {
                dispatcher(userActions.setValue(response.data.token));
                console.log(response.data.user.username);
                dispatcher(userActions.setUsername(response.data.user.username));
            }
            
            dispatcher(userActions.setValue(`${response.data.token}`));
            
            setActionResult({ type: 'success', message: response.data.message }); // Test when can log in again

            return response;
        } catch (error) {
            console.error(error);

            try { setActionMessage((error as any).response.data.message); } catch(e) { setActionMessage('Error logging in user'); }
            try { setActionResult({ type: 'danger', message: (error as any).response.data.message }); } catch(e) { setActionResult({ type: 'danger', message: 'Error logging in user' }); }
        }

    }


    return (
        <div>
            <Container>
                <Form>
                    <Row className='mt-3'>
                        <Col align='center'><h1>Welcome to Superhero Battles</h1></Col>
                    </Row>
                    <Row className='mt-5'></Row>
                    <Row className='mt-5'></Row>
                    <Row>
                        <RegisterInput registerUser={registerUser} loginUser={loginUser} actionResult={actionResult}/>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}

export default RegisterContainer