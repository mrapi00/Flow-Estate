export const createSale = `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import NFTix from 0xb56c63fb07b02496
import Marketplace from 0xb56c63fb07b02496

// This transaction allows the Minter account to mint an NFT
// and deposit it into its collection.

transaction(id: UInt64, price: UFix64) {
    prepare(acct: AuthAccount) {

        let sale <- acct.load<@Marketplace.SaleCollection>(from: Marketplace.SaleCollectionStoragePath) ?? panic("could not get sale collection: was it set up?")

        // List the token for sale by moving it into the sale object
        sale.listForSale(tokenID: id, price: price)

        // Store the sale object in the account storage
        acct.save(<-sale, to: Marketplace.SaleCollectionStoragePath)

        log("created sale")
    }
}
`