import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
import { Navbar, Nav, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthContext } from './Authenticate';

import Mint from './Mint';
import Profile from './Profile';
import SearchProfile from './SearchProfile';
import SetupAccount from './SetupAccount';

import * as fcl from '@blocto/fcl';

const ProfileWrapper = () => {
    const { addr } = useParams();
    return <Profile blockchainId={addr!} nftsForSale={[]} />
}

const MainApp = () => {
    const auth = useContext(AuthContext);
    return (
        <>
            <Navbar bg="light" expand="lg" style={{fontFamily: 'Roboto Mono, sans-serif', paddingLeft: "15px", paddingRight: "15px"}}>
                <Navbar.Brand as={Link} to="/"><Image src="/estate_logo.png" width="75px" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
                        <Nav.Link as={Link} to="/mint">Mint</Nav.Link>
                        <Nav.Link as={Link} to="/find_profile">Find Profile</Nav.Link>
                    </Nav>
                    <Button onClick={() => {
                        fcl.unauthenticate();
                    }}>Sign Out</Button>
                </Navbar.Collapse>
            </Navbar>

            <Routes>
                <Route path="profile/:addr" element={<ProfileWrapper />} />
                <Route path="/profile" element={<Profile blockchainId={auth.user.addr} nftsForSale={[]} />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/find_profile" element={<SearchProfile />} />
                <Route path="/" element={<SetupAccount />} />
            </Routes>
        </>
    );
};
export default MainApp;