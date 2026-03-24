import SMS2FlowVirtualWallet from 0xbcc2b6820b8f616d

access(all) contract SMS2FlowCommandTransfer {
    access(all) event TransferRequested(
        transferId: UInt64,
        fromWalletId: String,
        toWalletId: String,
        amount: UFix64,
        memo: String
    )
    access(all) event TransferConfirmed(transferId: UInt64)
    access(all) event TransferCancelled(transferId: UInt64)

    access(self) var nextTransferId: UInt64
    access(self) var fromWalletById: {UInt64: String}
    access(self) var toWalletById: {UInt64: String}
    access(self) var amountById: {UInt64: UFix64}
    access(self) var memoById: {UInt64: String}
    access(self) var confirmationKeyById: {UInt64: String}
    access(self) var statusById: {UInt64: UInt8} // 1=pending, 2=confirmed, 3=cancelled

    init() {
        self.nextTransferId = 1
        self.fromWalletById = {}
        self.toWalletById = {}
        self.amountById = {}
        self.memoById = {}
        self.confirmationKeyById = {}
        self.statusById = {}
    }

    access(all) fun requestTransfer(
        fromWalletId: String,
        toWalletId: String,
        amount: UFix64,
        memo: String,
        confirmationKey: String
    ) {
        pre {
            fromWalletId.length > 0: "fromWalletId cannot be empty"
            toWalletId.length > 0: "toWalletId cannot be empty"
            amount > 0.0: "amount must be positive"
            confirmationKey.length >= 4: "confirmation key too short"
            confirmationKey.length <= 32: "confirmation key too long"
            fromWalletId != toWalletId: "cannot transfer to same wallet"
        }

        if SMS2FlowVirtualWallet.getOwner(walletId: fromWalletId) == nil {
            panic("source wallet does not exist")
        }

        if SMS2FlowVirtualWallet.getOwner(walletId: toWalletId) == nil {
            panic("destination wallet does not exist")
        }

        if SMS2FlowVirtualWallet.getBalance(walletId: fromWalletId) < amount {
            panic("insufficient balance")
        }

        let id = self.nextTransferId
        self.nextTransferId = self.nextTransferId + 1

        self.fromWalletById[id] = fromWalletId
        self.toWalletById[id] = toWalletId
        self.amountById[id] = amount
        self.memoById[id] = memo
        self.confirmationKeyById[id] = confirmationKey
        self.statusById[id] = 1

        emit TransferRequested(
            transferId: id,
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            amount: amount,
            memo: memo
        )
    }

    access(all) fun confirmTransfer(transferId: UInt64, confirmationKey: String) {
        pre {
            self.statusById[transferId] != nil: "transfer does not exist"
            self.statusById[transferId] == 1: "transfer is not pending"
            self.confirmationKeyById[transferId] == confirmationKey: "invalid confirmation key"
        }

        let fromWalletId = self.fromWalletById[transferId] ?? panic("missing source wallet")
        let toWalletId = self.toWalletById[transferId] ?? panic("missing destination wallet")
        let amount = self.amountById[transferId] ?? panic("missing amount")
        let memo = self.memoById[transferId] ?? ""

        SMS2FlowVirtualWallet.transfer(
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            amount: amount,
            memo: memo
        )

        self.statusById[transferId] = 2
        emit TransferConfirmed(transferId: transferId)
    }

    access(all) fun cancelTransfer(transferId: UInt64) {
        pre {
            self.statusById[transferId] != nil: "transfer does not exist"
            self.statusById[transferId] == 1: "transfer is not pending"
        }

        self.statusById[transferId] = 3
        emit TransferCancelled(transferId: transferId)
    }

    access(all) fun getTransferStatus(transferId: UInt64): UInt8 {
        return self.statusById[transferId] ?? 0
    }

    access(all) fun getLatestTransferId(): UInt64 {
        if self.nextTransferId == 1 {
            return 0
        }
        return self.nextTransferId - 1
    }
}
