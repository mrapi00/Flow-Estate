export const mint = `

import NFTix from 0xb56c63fb07b02496

// This transaction allows the Minter account to mint an NFT
// and deposit it into its collection.

transaction(image: String, seat: String, royalties: UFix64, metadata: String) {

    // The reference to the collection that will be receiving the NFT
    let receiverRef: &{NFTix.NFTReceiver}
    let acct: Address

    prepare(acct: AuthAccount) {
        // Get the owner's collection capability and borrow a reference
        self.acct = acct.address
        self.receiverRef = acct.getCapability<&{NFTix.NFTReceiver}>(NFTix.CollectionPublicPath)
            .borrow()
            ?? panic("Could not borrow receiver reference")
    }

    execute {
        // Use the minter reference to mint an NFT, which deposits
        // the NFT into the collection that is sent as a parameter.
        let newNFT <- NFTix.mintNFT(image: image, seat: seat, royalties: royalties, artist: self.acct, metadata: metadata)

        let id = newNFT.id

        self.receiverRef.deposit(token: <-newNFT)

        log("NFT minted with id: ")
        log(id)
    }
}
`