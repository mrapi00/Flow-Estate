export const purchase = `
    import NFTix from 0xb56c63fb07b02496
    import FlowToken from 0x7e60df042a9c0868
    import FungibleToken from 0x9a0766d93b6608b7
    import Marketplace from 0xb56c63fb07b02496

transaction(seller: Address, id: UInt64, price: UFix64) {

    // Capability to the buyer's NFT collection where they
    // will store the bought NFT
    let collectionCapability: Capability<&AnyResource{NFTix.NFTReceiver}>

    // Vault that will hold the tokens that will be used to
    // but the NFT
    var temporaryVault: @FungibleToken.Vault

    prepare(acct: AuthAccount) {

        // get the references to the buyer's fungible token Vault and NFT Collection Receiver
        self.collectionCapability = acct.getCapability<&AnyResource{NFTix.NFTReceiver}>(NFTix.CollectionPublicPath)

        let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
			?? panic("Could not borrow a reference to the owner's vault")

        // withdraw tokens from the buyers Vault
        self.temporaryVault <- vaultRef.withdraw(amount: price)
    }

    execute {
        // get the read-only account storage of the seller
        let seller = getAccount(seller)

        // get the reference to the seller's sale
        let saleRef = seller.getCapability(/public/NFTixSale)
                            .borrow<&AnyResource{Marketplace.SalePublic}>()
                            ?? panic("Could not borrow seller's sale reference")

        // purchase the NFT the the seller is selling, giving them the capability
        // to your NFT collection and giving them the tokens to buy it
        saleRef.purchase(tokenID: id, recipient: self.collectionCapability, buyTokens: <-self.temporaryVault)
        log("bought")
    }
}
`