import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {URL} from '../../App'
import { Badge, Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';


export default function HeroForm() { //default values for hero

    const [formData, setFormData] = useState({ heroName: "", alignment: "", description: "", backstory: "", stats: 0, avatar: 0 });

    const token = useSelector((auth: any) => auth.token.value);
    const user = useSelector((state: any) => state.token.username); //Get username from store (stays updated so only do once)
    //console.log(`TOKEN: ${token}`);
    //console.log(`USER: ${user}`);
    
    const { username } = useParams(); //gets the username out of /users/:username/customhero


    useEffect(() => { //initializes formData to be the user's hero
        getCustomHero((username as string) ? username as string : '') //get custom hero data from db
        .then(response => { 
            setFormData((prevFormData) => ({ ...prevFormData, ...response }));
        });
    }, []);

    async function getCustomHero(username: string) { //retrieves the customHero associated with the user in /users/:username/customhero
        try {

            if( !username ) { //verify we actually have a username
                return null;
            }

            let response = await axios.get(`${URL}/users/${username}/customhero`);

            if ( response && response.data ) //verify we got a response
                return response.data.data.data; //is this for real? why the hell did i make it like this
            else
                return null;

        } catch (error) {
            console.error(`ERROR!: ${error}`);
        }        
    };

    const handleChange = (event: any) => { //updates formData hook when a form input is changed

        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };


    const handleSubmit = (event: any) => { //submits new formData to DAO on pressing of submit button

        event.preventDefault();
        putCustomHero({ ...formData })
        .then(response => {
            //console.log(`REGISTER RESPONSE: ${JSON.stringify(response)}`);
        });
    };

    async function putCustomHero(data: any) { //put customHero into the db
        
        try {
            //console.log(` REGISTER: ${JSON.stringify(data)}`);
            axios({
                method: 'put',
                url: `${URL}/users/${username}/customization`,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}` //puts token in the headers
                },
                data
            }).then((response) => {
                return response;
            });
            return null;
            //return response;

        } catch (error) {
            console.error(`ERROR!: ${error}`);
        }

    }


   if( token && user === username ) { //how do we tell if we're logged in?
        return (
            <>
                <Container fluid>
                <Form onSubmit={handleSubmit}>
                        <Row>
                            <HeroAvatar id={formData.avatar}/>
                        </Row>
                        
                        <Row className="mb-3 mt-3">
                            <Col md={1}>
                                <FloatingLabel controlId="floatingInputAvatarID" label="Avatar ID">
                                    <Form.Control type="number" min="0" max="6" id="avatar" name="avatar" value={formData.avatar} onChange={handleChange} />
                                </FloatingLabel>
                            </Col>

                            <Col md={1}>
                                <FloatingLabel controlId="floatingInput" label="Name">
                                    <Form.Control type="text" id="heroName" name="heroName" placeholder="Your hero's name" value={formData.heroName} onChange={handleChange} />
                                </FloatingLabel>
                            </Col>

                            <Col md={1}>
                                <FloatingLabel controlId="floatingLabelAlignment" label="Alignment">
                                    <Form.Select id="alignment" name="alignment" value={formData.alignment} onChange={handleChange}>
                                        <option value="neutral">Neutral</option>
                                        <option value="good">Good</option>
                                        <option value="bad">Bad</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={3}>
                                <FloatingLabel controlId="floatingTextAreaDescription" label="Description">
                                    <Form.Control as="textarea" id="description" name="description" placeholder="Description of your hero" style={{ height: '100px' }} value={formData.description} onChange={handleChange}/>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col md={3}>
                                <FloatingLabel controlId="floatingTextAreaBackstory" label="Backstory">
                                    <Form.Control as="textarea" id="backstory" name="backstory" placeholder="Your hero's backstory" style={{ height: '100px' }} value={formData.backstory} onChange={handleChange}/>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col md={1}>
                                <FloatingLabel controlId="floatingInputAvatarID" label="Avatar ID">
                                    <Form.Control disabled readOnly type="number" id="stats" name="stats" min="1" max="731" value={formData.stats} onChange={handleChange}/>
                                </FloatingLabel>

                            </Col>
                            <Col>
                                <Button size="lg" onClick={async () => { axios.get(`${URL}/battleground/randomhero`).then((x: any) => x.data.id).then(x => setFormData((prevFormData) => ({ ...prevFormData, stats: x }))) } }>🎲</Button>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col md={1}>
                                <Button type="submit">Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>


{/* ************************************************************************************************************************************* */}



                {/* <form onSubmit={handleSubmit}>
                    
                    <label htmlFor="avatar">Avatar ID:</label>
                    <input type="number" min="0" max="6" id="avatar" name="avatar" value={formData.avatar} onChange={handleChange}/>
                    <br />

                    {
                        //<UserLink username={username}/>
                        //<br />
                        //<br />
                    }

                    <label htmlFor="heroName">Name:</label>
                    <br />
                    <input type="text" id="heroName" name="heroName" placeholder="Your hero's name" value={formData.heroName} onChange={handleChange}/>

                    <br />
                    <label htmlFor="alignment">
                        Alignment:
                        <br />
                        <input type="text" id="alignment" name="alignment" placeholder="good, bad, or neutral" value={formData.alignment} onChange={handleChange}/>
                    </label>
                    <br />
                    <br />
                    <label htmlFor="description">Description:</label>
                    <br />
                    <textarea id="description" name="description" placeholder="Description of your hero" value={formData.description} onChange={handleChange}/>
                    <br />
                    <br />

                    <label htmlFor="backstory">Backstory:</label>
                    <br />
                    <textarea id="backstory" name="backstory" placeholder="Your hero's backstory" value={formData.backstory} onChange={handleChange}/>
                    <br />
                    <br />
                    <label htmlFor="stats">Stats ID:</label>
                    <input type="number" min="1" max="731" id="stats" name="stats" value={formData.stats} onChange={handleChange}/>
                    <br />
                    <br />
                    <button type="submit">Submit</button>
                </form> */}
            </>
        );
    }
    else if(formData.heroName) {
        return (
            <div>
                <h1 id="heroName">{formData.heroName} <Badge>Custom Hero</Badge> <Badge bg={formData.alignment == 'good'?'success':formData.alignment == 'bad'?'danger':'secondary'}>{formData.alignment.charAt(0).toUpperCase() + formData.alignment.slice(1)}</Badge></h1>
                <HeroAvatar id={formData.avatar}/>
                <UserLink username={username}/>
                <p id="alignment"> Moral alignment: {formData.alignment} </p>
                <p id="description"> Description: {formData.description} </p>
                <p id="backstory"> Backstory: {formData.backstory} </p>
                <p id="stats"> Stats: {formData.stats} </p>
            </div>
        );
    }
    else {
        return (
            <div>
                <p>{username} does not have a custom hero yet.</p>
            </div>
        );
    }
}


function HeroAvatar({id = 0}) {

    let path = require(`../../img/hero-avatars/hero_${id}.png`);

    return (
        <div>
            <img id="heroAvatar" alt="Custom Superhero Avatar" style={{width:"500px", height:"500px", objectFit: 'cover'}} src={path} />
        </div>
    );
}

function UserLink({username=""}) {

    let path = `/users/${username}`;

    return (
        <Link className="nav-link" to={path} style={{ display: 'inline-block' }}>
            Created by <u style={{color: '#32a852'}}>{username}</u>
        </Link>
    );
}