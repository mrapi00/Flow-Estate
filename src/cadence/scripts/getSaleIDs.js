export const getSaleData = `

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import NFTix from 0xb56c63fb07b02496
import Marketplace from 0xb56c63fb07b02496

// Print all the sale IDs for a given account and their prices
pub fun main(addr: Address): {UInt64: UFix64} {
    // Get the public account object for account 0x01
    let account = getAccount(addr)
    var output: {UInt64: UFix64} = {}

    // Find the public Sale reference to their Collection
    let saleRef = seller.getCapability(/public/NFTixSale)
                            .borrow<&AnyResource{Marketplace.SalePublic}>()
                            ?? panic("Could not borrow seller's sale reference")

    for id in acctsaleRef.getIDs() {
        output[id] = acctsaleRef.idPrice(tokenID: id)
    }

    return output
}

`