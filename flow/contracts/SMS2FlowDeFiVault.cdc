access(all) contract SMS2FlowDeFiVault {
    access(all) event Deposited(walletId: String, amount: UFix64)
    access(all) event Withdrawn(walletId: String, amount: UFix64)
    access(all) event InternalTransfer(fromWalletId: String, toWalletId: String, amount: UFix64)

    access(self) var balances: {String: UFix64}

    init() {
        self.balances = {}
    }

    access(all) fun deposit(walletId: String, amount: UFix64) {
        pre {
            walletId.length > 0: "walletId cannot be empty"
            amount > 0.0: "amount must be positive"
        }

        let current = self.balances[walletId] ?? 0.0
        self.balances[walletId] = current + amount
        emit Deposited(walletId: walletId, amount: amount)
    }

    access(all) fun withdraw(walletId: String, amount: UFix64) {
        pre {
            walletId.length > 0: "walletId cannot be empty"
            amount > 0.0: "amount must be positive"
            (self.balances[walletId] ?? 0.0) >= amount: "insufficient balance"
        }

        let current = self.balances[walletId] ?? 0.0
        self.balances[walletId] = current - amount
        emit Withdrawn(walletId: walletId, amount: amount)
    }

    access(all) fun transferInternal(fromWalletId: String, toWalletId: String, amount: UFix64) {
        pre {
            fromWalletId.length > 0: "fromWalletId cannot be empty"
            toWalletId.length > 0: "toWalletId cannot be empty"
            amount > 0.0: "amount must be positive"
            (self.balances[fromWalletId] ?? 0.0) >= amount: "insufficient balance"
        }

        let fromBalance = self.balances[fromWalletId] ?? 0.0
        let toBalance = self.balances[toWalletId] ?? 0.0

        self.balances[fromWalletId] = fromBalance - amount
        self.balances[toWalletId] = toBalance + amount
        emit InternalTransfer(fromWalletId: fromWalletId, toWalletId: toWalletId, amount: amount)
    }

    access(all) fun getBalance(walletId: String): UFix64 {
        return self.balances[walletId] ?? 0.0
    }
}
