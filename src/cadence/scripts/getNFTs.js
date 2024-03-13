export const getMyNFT = `
import NFTix from 0xb56c63fb07b02496

pub fun main(address: Address): [{String: String}] {

    let account = getAccount(address)
	
    let acctCapability = account.getCapability(NFTix.CollectionPublicPath)

    // borrow reference from the capability
    let receiverRef = acctCapability.borrow<&{NFTix.NFTReceiver}>()
        ?? panic("Could not borrow account")
    
    let allNfts: [{String: String}] = []

    for id in receiverRef.getIDs() {
        allNfts.append(receiverRef.getData(id: id))
    }


    // Print both collections as arrays of IDs
    log("Account NFTs")
    log(allNfts)

    return allNfts
  
}`;