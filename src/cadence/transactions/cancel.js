export const cancelSale = `

// cancel.cdc

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import NFTix from 0xb56c63fb07b02496
import Marketplace from 0xb56c63fb07b02496


// cancel a group of sales for the reservation
transaction(id: UInt64) {
    
    prepare(acct: AuthAccount) {
        let saleCollection <- acct.load<@Marketplace.SaleCollection>(from: Marketplace.SaleCollectionStoragePath) 
        let saleCollectionP <- saleCollection ?? panic("oops")
        saleCollectionP.cancelSale(tokenID: id)
        acct.save(<-saleCollectionP, to: Marketplace.SaleCollectionStoragePath)
    }
}

`