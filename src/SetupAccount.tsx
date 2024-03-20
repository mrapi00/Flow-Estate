import { Button, Container, Image} from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { setupAccount } from './apiCalls';

const SetupAccount = () => {
    const navigate = useNavigate();
    return (
        <Container className="d-flex justify-content-center align-items-center flex-column" style={{ height: '100vh' }}>
          <Image src="/estate_logo.png" width="200px" />
          <h1>Welcome to FlowEstate! </h1>
          <h1> Setup NFT account to get started!</h1>
          <Button variant="primary" onClick={async () => {
            await setupAccount();
            navigate('/profile');
          }}>Setup</Button>
        </Container>
      );
}

export default SetupAccount;