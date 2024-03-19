import {useContext} from 'react';
import { AuthContext } from './Authenticate';
import { Button, Container } from 'react-bootstrap';
import * as fcl from "@blocto/fcl"
import { Navigate, useParams } from 'react-router-dom';



const Login = () => {
    const params = useParams();
    const auth = useContext(AuthContext);
    if (auth.user && auth.user.addr) {
        return <Navigate to="/" />
    }
    return (
        <Container className="d-flex justify-content-center align-items-center flex-column" style={{ height: '100vh' }}>
          <h1>Login to your Flow wallet</h1>
          <Button variant="primary" onClick={() => {
            fcl.authenticate();
          }}>Login</Button>
        </Container>
      );
}

export default Login;