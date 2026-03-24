access(all) contract SMS2FlowVirtualWallet {
    access(all) event VirtualWalletCreated(walletId: String, owner: Address)
    access(all) event VirtualWalletFunded(walletId: String, amount: UFix64)
    access(all) event VirtualWalletTransferred(fromWalletId: String, toWalletId: String, amount: UFix64, memo: String)

    access(self) var balances: {String: UFix64}
    access(self) var owners: {String: Address}

    init() {
        self.balances = {}
        self.owners = {}
    }

    access(all) fun createWallet(walletId: String, owner: Address) {
        pre {
            walletId.length > 0: "walletId cannot be empty"
            self.owners[walletId] == nil: "wallet already exists"
        }

        self.owners[walletId] = owner
        self.balances[walletId] = 0.0

        emit VirtualWalletCreated(walletId: walletId, owner: owner)
    }

    access(all) fun fundWallet(walletId: String, amount: UFix64) {
        pre {
            self.owners[walletId] != nil: "wallet does not exist"
            amount > 0.0: "amount must be greater than zero"
        }

        let current = self.balances[walletId] ?? 0.0
        self.balances[walletId] = current + amount

        emit VirtualWalletFunded(walletId: walletId, amount: amount)
    }

    access(all) fun transfer(fromWalletId: String, toWalletId: String, amount: UFix64, memo: String) {
        pre {
            self.owners[fromWalletId] != nil: "source wallet does not exist"
            self.owners[toWalletId] != nil: "destination wallet does not exist"
            amount > 0.0: "amount must be greater than zero"
            (self.balances[fromWalletId] ?? 0.0) >= amount: "insufficient balance"
        }

        let fromBalance = self.balances[fromWalletId] ?? 0.0
        let toBalance = self.balances[toWalletId] ?? 0.0

        self.balances[fromWalletId] = fromBalance - amount
        self.balances[toWalletId] = toBalance + amount

        emit VirtualWalletTransferred(
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            amount: amount,
            memo: memo
        )
    }

    access(all) fun getBalance(walletId: String): UFix64 {
        return self.balances[walletId] ?? 0.0
    }

    access(all) fun getOwner(walletId: String): Address? {
        return self.owners[walletId]
    }
}
