import React from "react";
import { Badge, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NavBar(props: any) {
    const randColor = () => {
        const colors = ['aqua', 'blue', 'blueviolet', 'brown', 'chartreuse', 'crimson', 'darkblue', 'darkgoldenrod', 'darkgreen', 'darkmagenta', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkviolet', 'forestgreen', 'gold', 'goldenrod', 'green', 'greenyellow', 'indigo', 'hotpink', 'lawngreen', 'lightgreen', 'lightseagreen', 'lime', 'limegreen', 'maroon', 'red', 'springgreen', 'yellow', 'tomato'];

        const x = Math.floor(Math.random() * (colors.length - 1));

        return colors[x] || 'red';
    }

    let dispatcher = useDispatch();
    const username = useSelector((state: any) => state.token.username);

    return (
        <nav className="navbar navbar-expand-lg navbar-light ">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    SuperHero Battles
                </Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {props.pathArray.map((obj: any, index: any) => {
                            return (
            
                                <li key={index}>
                                    <Link className="nav-link" to={obj.path}>
                                        {obj.buttonName}
                                    </Link>
                                </li>

                            );
                        })}
                    </ul>
                </div>
                <Col align='right'>
                    <h3><Badge bg='invalid bg value forces it to use backgroundColor' style={{backgroundColor: randColor()}}>{ username ? username : 'Guest' }</Badge></h3>
                </Col>
            </div>
        </nav>
    );
}

export default NavBar;