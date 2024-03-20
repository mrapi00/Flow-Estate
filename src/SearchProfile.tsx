import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';

const SearchPage: React.FC = () => {
    const [accountId, setAccountId] = useState('');
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setAccountId(value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Validate the account ID format before submitting
        if (/^0x[a-fA-F0-9]+$/.test(accountId)) {
            navigate(`/profile/${accountId}`);
        } else {
            alert('Enter a valid hexadecimal wallet ID.')
        }
    }

    return (
        <div className='d-flex flex-column align-items-center justify-content-center' style={{height: '90vh'}}>
            <div style={{width: '100%'}}>
                <h1 className='text-center md-4'>Find a Profile</h1>
                <Form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center'>
                    <InputGroup className="mb-3" style={{ maxWidth: '60%', paddingTop: '20px' }}>
                        <FormControl
                            placeholder="Account ID"
                            aria-label="Account ID"
                            aria-describedby="basic-addon2"
                            value={accountId}
                            onChange={handleChange}
                            maxLength={42} // Adjust based on your requirements
                            pattern="^0x[a-fA-F0-9]+$"
                        />
                        <Button variant="primary" type="submit">Submit</Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    );
};

export default SearchPage;