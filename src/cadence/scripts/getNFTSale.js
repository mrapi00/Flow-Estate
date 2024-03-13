export const getNFTSale = `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import NFTix from 0xb56c63fb07b02496
import Marketplace from 0xb56c63fb07b02496

pub fun main(addr: Address): [{String: String}] {
    // Get the public account object for account 0x01
    let account = getAccount(addr)
    var output: [{String: String}] = []

    // Find the public Sale reference to their Collection
    let acctsaleRef = account.getCapability(/public/NFTixSale)
    .borrow<&AnyResource{Marketplace.SalePublic}>()
    ?? panic("Could not borrow seller's sale reference")

    let acctCapability = account.getCapability(NFTix.CollectionPublicPath)

    // borrow reference from the capability
    let receiverRef = acctCapability.borrow<&{NFTix.NFTReceiver}>()
        ?? panic("Could not borrow account")

    for id in acctsaleRef.getIDs() {
        let curr = receiverRef.getData(id: id)
        curr["price"] = acctsaleRef.idPrice(tokenID: id)!.toString()
        output.append(curr)
    }

    return output
}`;