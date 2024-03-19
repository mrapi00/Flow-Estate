import * as fcl from '@blocto/fcl';

import { mint } from './cadence/transactions/mint';
import { createSale } from './cadence/transactions/create';
import { setup } from './cadence/transactions/setup';
import { getMyNFT } from './cadence/scripts/getNFTs';
import { purchase } from './cadence/transactions/purchase';
import { getFlowBalances } from './cadence/scripts/getBalance';
import { getNFTSale } from './cadence/scripts/getNFTSale';
import { cancelSale } from './cadence/transactions/cancel';

function convertToFixed(num: string): string {
    if (num.indexOf('.') == -1) {
        return `${num}.0`
    } else return num
}

export const mintNFT = async ({ image, seat, royalties, data }: { image: string, seat: string, royalties: string, data: string }) => {
    const transactionID = await fcl
        .send([
            fcl.transaction(mint),
            fcl.args([
                fcl.arg(image, fcl.t.String),
                fcl.arg(seat, fcl.t.String),
                fcl.arg(convertToFixed(royalties), fcl.t.UFix64),
                fcl.arg(data, fcl.t.String),
            ]),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999),
        ])
        .then(fcl.decode);

    console.log(transactionID);
};


export const createNFTsale = async ({ id, price }: { id: string, price: string }): Promise<boolean> => {
    const transactionID = await fcl
        .send([
            fcl.transaction(createSale),
            fcl.args([
                fcl.arg(id, fcl.t.UInt64),
                fcl.arg(convertToFixed(price), fcl.t.UFix64),
            ]),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999),
        ])
        .then(fcl.decode);

    console.log(transactionID);
    const results = await fcl.tx(transactionID).onceSealed();
    console.log(results);
    return results.errorMessage === "";
};

export const cancelNFTsale = async ({ id }: { id: string }): Promise<boolean> => {
    const transactionID = await fcl
        .send([
            fcl.transaction(cancelSale),
            fcl.args([
                fcl.arg(id, fcl.t.UInt64),
            ]),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999),
        ])
        .then(fcl.decode);

    console.log(transactionID);
    const results = await fcl.tx(transactionID).onceSealed();
    console.log(results);
    return results.errorMessage === "";
};



export const setupAccount = async () => {
    const transactionID = await fcl
        .send([
            fcl.transaction(setup),
            fcl.args(),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999),
        ])
        .then(fcl.decode);
    console.log(transactionID);
};

export const getFlowBalance = async ({ user }: { user: any }): Promise<any> => {
    const response = await fcl.send([
        fcl.script(getFlowBalances),
        fcl.args([fcl.arg(user, fcl.t.Address)]),
    ]);
    const data = await fcl.decode(response);
    return data;
};

export const getAllNFTs = async ({ address }: { address: string }): Promise<any[]> => {
    try {
        const response = await fcl.send([
            fcl.script(getMyNFT),
            fcl.args([fcl.arg(address, fcl.t.Address)]),
        ]);
        const data = await fcl.decode(response);
        return data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const purchaseNFT = async ({ addr, id, price }: { addr: string, id: string, price: string }): Promise<boolean> => {
    const transactionID = await fcl
        .send([
            fcl.transaction(purchase),
            fcl.args([
                fcl.arg(addr, fcl.t.Address),
                fcl.arg(id, fcl.t.UInt64),
                fcl.arg(price, fcl.t.UFix64),
            ]),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999),
        ])
        .then(fcl.decode);

    console.log(transactionID);
    const results = await fcl.tx(transactionID).onceSealed();
    console.log(results);
    return results.errorMessage === "";
};

export const getNFTsale = async (addr: string) => {
    try {
        const response = await fcl.send([
            fcl.script(getNFTSale),
            fcl.args([fcl.arg(addr, fcl.t.Address)]),
        ]);
        const saledata = await fcl.decode(response);
        console.log(saledata);
        return saledata;
    } catch (e) {
        console.error(e);
        return [];
    }
};