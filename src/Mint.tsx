import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { mintNFT } from './apiCalls';

const MintForm = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [seat, setSeat] = useState('');
    const royalties = "0.0";
    const [data, setData] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        mintNFT({ image: imageUrl, seat, royalties, data });
        setImageUrl("");
        setSeat("");
        setData("");
    };

    return (
        <Container className='my-4'>
            <h1 className="text-center mb-4">Mint a Token</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formImageUrl">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="url"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSeat">
                    <Form.Label>House Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter house address"
                        value={seat}
                        onChange={(e) => setSeat(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Additional Info</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Enter any additional info to associate with the NFT'
                        value={data}
                        onChange={e => setData(e.currentTarget.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Mint
                </Button>
            </Form>
        </Container>
    );
};

export default MintForm;