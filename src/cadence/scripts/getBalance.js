export const getFlowBalances = `
    import FlowToken from 0x7e60df042a9c0868
    import FungibleToken from 0x9a0766d93b6608b7

    pub fun main(address: Address): UFix64 {
      let account = getAccount(address)

      let vaultRef = account.getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

      return vaultRef.balance
    }
  `;