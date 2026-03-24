import SMS2FlowVirtualWallet from 0xbcc2b6820b8f616d

transaction(fromWalletId: String, toWalletId: String, amount: UFix64, memo: String) {
    prepare(signer: auth(BorrowValue) &Account) {}

    execute {
        SMS2FlowVirtualWallet.transfer(
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            amount: amount,
            memo: memo
        )
    }
}
