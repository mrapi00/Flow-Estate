import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Modal, ButtonGroup } from 'react-bootstrap';
import { cancelNFTsale, createNFTsale, getAllNFTs, getFlowBalance, getNFTsale, purchaseNFT } from './apiCalls';
import QRCodePopup from './QRCodePopup';
import { AuthContext } from './Authenticate';

interface NFTCardProps {
    imageUrl: string;
    artistId: string;
    seat: string;
    royalties: string;
    data: string;
    price?: string;

    buttonLabel?: string;
    onClick?: () => void;

    secondaryButtonLabel?: string;
    onSecondaryClick?: () => void;
}

// use as placeholder until waiting for Zillow API
function addCommasToNumber(): string {
    const number = 405000 + Math.floor(Math.random() * 10001)
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// NFTCard component
const NFTCard: React.FC<NFTCardProps> = ({ imageUrl, artistId, seat, price, royalties, data, buttonLabel, onClick, secondaryButtonLabel, onSecondaryClick }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={imageUrl} />
            <Card.Body>
                <Card.Title>NFT Details</Card.Title>
                <Card.Text>
                    <strong>Vendor ID:</strong> {artistId}<br />
                    <strong>House Address:</strong> {seat}<br />
                    {price ? <><strong>Price:</strong> {price} FLOW<br /></> : null}
                    <strong>Zestimate® (USD):</strong> ${addCommasToNumber()}<br />
                </Card.Text>
                <ButtonGroup>
                    {buttonLabel && onClick ?
                        <Button variant="primary" onClick={onClick}>{buttonLabel}</Button> : null}
                    {secondaryButtonLabel && onSecondaryClick ?
                        <Button variant="secondary" onClick={onSecondaryClick}>{secondaryButtonLabel}</Button> : null}
                </ButtonGroup>
            </Card.Body>
        </Card>
    );
};

interface NFTItem {
    id: string,
    image: string,
    seat: string,
    royalties: string,
    artist: string,
    data: string,
}

interface SaleNFTItem extends NFTItem {
    price: string,
}

interface ProfileProps {
    blockchainId: string; // Placeholder for blockchain ID
    nftsForSale: NFTItem[]; // Array of NFTs for sale
}

const NoNFTsPlaceholder: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div style={{}}>
            <p>{message}</p>
        </div>
    );
};

const SellNFTModal: React.FC<{ id: string, onSell: (price: string) => void, isOpen: boolean, onClose: () => void }> = ({ id, isOpen, onClose, onSell }) => {
    const [price, setPrice] = useState('');

    const handleSell = () => {
        onSell(price);
        onClose();
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrice(value);
    };

    return (
        <>
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sell NFT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Price (in FLOW)</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={handlePriceChange}
                                placeholder="Enter price"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSell} disabled={price === ''}>
                        Sell
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const Profile: React.FC<ProfileProps> = ({ blockchainId }) => {
    const [nfts, setNFTs] = useState(null as any | null);
    const [saleNFTs, setSaleNFTs] = useState([] as SaleNFTItem[])
    const [currNft, setCurrNft] = useState(null as NFTItem | null);
    const [qrCodeContent, setQrCodeContent] = useState("");
    const [balance, setBalance] = useState(null as string | null);

    const auth = useContext(AuthContext);
    const isAuthId = blockchainId === auth.user?.addr;

    useEffect(() => {
        const getData = async (id: string) => {
            const [nfts, saleNFTs, balance] = await Promise.all([getAllNFTs({ address: blockchainId }), getNFTsale(blockchainId), getFlowBalance({user: blockchainId})])
            let saleIds = new Set();
            for (const saleNFT of saleNFTs) {
                saleIds.add(saleNFT.id);
            }
            const filteredNFTs = nfts.filter(nft => !saleIds.has(nft.id));
            setNFTs(filteredNFTs);
            setSaleNFTs(saleNFTs);
            setBalance(balance);
        };
        getData(blockchainId);

    }, [blockchainId]);
    return (
        <Container style={{ fontFamily: 'Helvetica-Bold', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
            <h1 className='text-center mb-4'>{blockchainId} Profile</h1>
            <p>Wallet ID: {blockchainId}</p>
            { balance !== null ? (<p>Balance: <span style={{ color: 'green' }}>{balance} FLOW</span></p> ) : null }

            <h2>Collection</h2>
            <SellNFTModal id={currNft?.id || ""} isOpen={currNft != null} onClose={() => setCurrNft(null)} onSell={async (price) => {
                if (price !== '') {
                    const nft = currNft!;
                    // Implement the selling logic here
                    console.log("Selling at price:", price);
                    const success = await createNFTsale({ id: nft.id, price });
                    if (success) {
                        setNFTs(nfts.filter((n: any) => n.id !== currNft!.id))
                        const saleNft = { ...nft, price };
                        setSaleNFTs([...saleNFTs, saleNft])
                    }
                }
            }} />
            <QRCodePopup content={qrCodeContent} isOpen={qrCodeContent != ""} onClose={() => setQrCodeContent("")} />
            <Row>
                {nfts && nfts.length > 0 ? nfts.map((nft: NFTItem, index: number) => (
                    <Col key={index} xs={12} md={6} lg={4}>
                        <NFTCard
                            imageUrl={nft.image}
                            artistId={nft.artist}
                            seat={nft.seat}
                            royalties={nft.royalties}
                            data={nft.data}
                            buttonLabel="Sell"
                            onClick={isAuthId ? () => {
                                setCurrNft(nft);
                            } : undefined}
                            secondaryButtonLabel={isAuthId ? 'QR Code' : undefined}
                            onSecondaryClick={isAuthId ? () => {
                                setQrCodeContent(JSON.stringify({addr: blockchainId, id: nft.id}))
                            } : undefined}
                        />
                    </Col>
                )) : <NoNFTsPlaceholder message='This user has no NFTs in their collection yet.' />}
            </Row>

            <h2>For Sale</h2>
            <Row>
                {saleNFTs.length > 0 ? saleNFTs.map((nft, index) => (
                    <Col key={index} xs={12} md={6} lg={4}>
                        <NFTCard imageUrl={nft.image} artistId={nft.artist} seat={nft.seat} price={nft.price} royalties={nft.royalties} data={nft.data} buttonLabel={isAuthId ? "Cancel sale" : "Buy"} onClick={async () => {
                            if (isAuthId) {
                                const success = await cancelNFTsale({ id: nft.id })
                                if (success) {
                                    // @ts-ignore
                                    delete nft['price'];
                                    setNFTs([...nfts, nft]);
                                    setSaleNFTs(saleNFTs.filter(n => n.id !== nft.id));
                                }
                            } else {
                                const success = await purchaseNFT({ addr: blockchainId, id: nft.id, price: nft.price })
                                if (success) {
                                    setSaleNFTs(saleNFTs.filter(n => n.id === nft.id));
                                }
                            }
                        }} />
                    </Col>
                )) : <NoNFTsPlaceholder message='This user has no NFTs for sale right now.' />}
            </Row>
        </Container>
    );
};

export default Profile;