import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { requestedBattleActions } from '../Redux/slices/requestedBattleSlice';
import HeroForm from '../CustomHeroPage/HeroForm';
import { URL } from '../../App';
import FollowButton from '../FollowButton/FollowButton';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';

function UserProfile() {

    const [user, setUser] = useState(null as any);
    const [userTypeMessage, setUserTypeMessage] = useState('');
    const [formData, setFormData] = useState({ alignment: "" });

    let { username } = useParams();
    // takes the value of the token stored during login. Must add to everything that requires auth
    const token = useSelector((auth: any) => auth.token.value);
    const loggedInUser = useSelector((auth: any) => auth.token.username);

    const dispatch = useDispatch();

    useEffect(() => {
        getUser((username as string) ? username as string : '')
        .then(x => { setUser(x); });
    }, [userTypeMessage]);

    async function getUser(username: string) {
        try {
            if (!username) {
                return null;
            }

            let response = await axios.get(`${URL}/users/${username}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}` //puts token in the headers
                    }
                });
            const userObj = response && response.data && response.data.user ? response.data.user : null;

            return userObj;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (event: any) => { //submits new formData to DAO on pressing of submit button

        event.preventDefault();
        putUser({ ...formData })
        .then(response => {
            //console.log(`REGISTER RESPONSE: ${JSON.stringify(response)}`);
        });
        
    };

    const handleChange = (event: any) => { //updates formData hook when a form input is changed

        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    async function putUser(data: any) { //put user data into the db
        
        try {
            //console.log(` REGISTER: ${JSON.stringify(data)}`);
            axios({
                method: 'put',
                url: `${URL}/users/${username}`,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}` //puts token in the headers
                },
                data
            }).then((response) => {
                return response;
            });
            return null;

        } catch (error) {
            console.error(`ERROR!: ${error}`);
        }

    }

    const request1v1 = () => {
        dispatch(requestedBattleActions.setRequestedBattle({
            challenger: loggedInUser,
            // -1 denotes custom hero
            challengerTeam: [-1], 
            opponent: username,
            opponentTeam: [-1]
        }));
    };

    const request3v3 = () => {
        dispatch(requestedBattleActions.setRequestedBattle({
            challenger: loggedInUser,
            // -1 denotes custom hero
            challengerTeam: [-1, 0, 0], 
            opponent: username,
            opponentTeam: [-1, 0, 0]
        }));
    };

    return (
        <div>
            {
                user ?
                    <>
                        <p>{userTypeMessage}</p>
                        <p>
                            User: {user.username}
                        </p>
                        <p onChange={handleChange}>
                            Alignment: {user.alignment ? user.alignment : '<not specified>'}
                        </p>
                        { loggedInUser === username ? 
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="alignment">
                                    Set alignment: &emsp;
                                    <select id="alignment" name="alignment"  value={formData.alignment} onChange={handleChange}> 
                                        <option value=""></option>
                                        <option value="good">Good</option>
                                        <option value="bad">Bad</option>
                                        <option value="neutral">Neutral</option>
                                    </select>
                                </label>
                                <br />
                                <Button type="submit">Submit</Button>
                            </form>
                            : <div></div>
                        }
                        <br />
                        <p>
                            {`Wins: ${user.wins} Losses: ${user.losses}`}
                        </p>
                        <p>
                            {`Followers: ${user.followers} Following: ${user.following}`}
                        </p>
                        {/* <FollowButton></FollowButton> */}
                        <br />
                        <div>
                            <CustomHeroLink username={username}/>

                            <br />
                            <br />
                            
                            {loggedInUser ? 
                            (
                                <>
                                    <Link className="nav-link" to={'/battle'} onClick={request1v1} style={{ display: 'inline-block' }}
                                    title='Battle using your custom hero versus theirs'>
                                        <Button>1v1 me</Button>
                                    </Link>

                                    <br />
                                    <br />

                                    <Link className="nav-link" to={'/battle'} onClick={request3v3} style={{ display: 'inline-block' }}
                                    title='Battle using your custom hero and two random allies'>
                                        <Button>3v3 me</Button>
                                    </Link>
                                </>
                            ) :
                            <Link className="nav-link" to={'/'} style={{ display: 'inline-block' }}>
                                <Button>Log in to battle {username}!</Button>
                            </Link>
                            }
                        </div>
                    </>
                    : 
                    // <Link className="nav-link" to={'/'} style={{ display: 'inline-block' }}>
                    //     <Button>Log in to view user accounts</Button>
                    // </Link>
                    <Container fluid>
                    <Row>
                        <Col md={4}>
                        <Alert variant='danger'>User not found</Alert>
                        </Col>
                    </Row>
                    </Container>
            }
        </div>
    )
}

function CustomHeroLink({username=""}) {

    let path = `/users/${username}/customhero`;

    return (
            // Display inline block allows React Link to not be 100%
            // (https://stackoverflow.com/a/72326049)
            <Link className="nav-link" to={path} style={{display: 'inline-block'}}>
                <Button>See my Custom Hero!</Button>
            </Link>
            // <HeroForm />
    );
}

export default UserProfile