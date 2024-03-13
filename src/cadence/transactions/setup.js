export const setup = `
    import NFTix from 0xb56c63fb07b02496
    import FlowToken from 0x7e60df042a9c0868
    import FungibleToken from 0x9a0766d93b6608b7
    import Marketplace from 0xb56c63fb07b02496

    transaction {
        prepare(acct: AuthAccount) {
    
          // Create a new empty collection
          let collection <- NFTix.createEmptyCollection()
  
          // store the empty NFT Collection in account storage
          acct.save<@NFTix.Collection>(<-collection, to: NFTix.CollectionStoragePath)
  
          // create a public capability for the Collection
          acct.link<&{NFTix.NFTReceiver}>(NFTix.CollectionPublicPath, target: NFTix.CollectionStoragePath)
            
          // Borrow a reference to the stored Vault
          let receiver = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    
          // borrow a reference to the nftTutorialCollection in storage
          let collectionCapability = acct.link<&NFTix.Collection>(/private/nftCollection, target: NFTix.CollectionStoragePath)
            ?? panic("Unable to create private link to NFT Collection")
      
          // Create a new Sale object,
          // initializing it with the reference to the owner's vault
          let sale <- Marketplace.createSaleCollection(ownerCollection: collectionCapability, ownerVault: receiver)
  
          // Store the sale object in the account storage
          acct.save(<-sale, to: Marketplace.SaleCollectionStoragePath)
  
          // Create a public capability to the sale so that others can call its methods
          acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(Marketplace.SaleCollectionPublicPath, target: Marketplace.SaleCollectionStoragePath)
        }
}
  `;