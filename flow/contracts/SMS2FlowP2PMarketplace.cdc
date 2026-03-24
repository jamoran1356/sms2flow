access(all) contract SMS2FlowP2PMarketplace {
    access(all) event OfferCreated(id: UInt64, makerWalletId: String, amount: UFix64, price: UFix64)
    access(all) event OfferFilled(id: UInt64, takerWalletId: String)
    access(all) event OfferCancelled(id: UInt64)

    access(all) struct Offer {
        access(all) let id: UInt64
        access(all) let makerWalletId: String
        access(all) let amount: UFix64
        access(all) let price: UFix64
        access(contract) var isActive: Bool

        init(id: UInt64, makerWalletId: String, amount: UFix64, price: UFix64, isActive: Bool) {
            self.id = id
            self.makerWalletId = makerWalletId
            self.amount = amount
            self.price = price
            self.isActive = isActive
        }

        access(all) fun getIsActive(): Bool {
            return self.isActive
        }

        access(contract) fun deactivate() {
            self.isActive = false
        }
    }

    access(self) var nextOfferId: UInt64
    access(self) var offers: {UInt64: Offer}

    init() {
        self.nextOfferId = 1
        self.offers = {}
    }

    access(all) fun createOffer(makerWalletId: String, amount: UFix64, price: UFix64): UInt64 {
        pre {
            makerWalletId.length > 0: "makerWalletId cannot be empty"
            amount > 0.0: "amount must be positive"
            price > 0.0: "price must be positive"
        }

        let id = self.nextOfferId
        self.nextOfferId = self.nextOfferId + 1
        self.offers[id] = Offer(
            id: id,
            makerWalletId: makerWalletId,
            amount: amount,
            price: price,
            isActive: true
        )

        emit OfferCreated(id: id, makerWalletId: makerWalletId, amount: amount, price: price)
        return id
    }

    access(all) fun fillOffer(offerId: UInt64, takerWalletId: String) {
        pre {
            takerWalletId.length > 0: "takerWalletId cannot be empty"
            self.offers[offerId] != nil: "offer does not exist"
        }

        var offer = self.offers[offerId]!
        if !offer.getIsActive() {
            panic("offer already inactive")
        }

        offer.deactivate()
        self.offers[offerId] = offer
        emit OfferFilled(id: offerId, takerWalletId: takerWalletId)
    }

    access(all) fun cancelOffer(offerId: UInt64) {
        pre {
            self.offers[offerId] != nil: "offer does not exist"
        }

        var offer = self.offers[offerId]!
        if !offer.getIsActive() {
            panic("offer already inactive")
        }

        offer.deactivate()
        self.offers[offerId] = offer
        emit OfferCancelled(id: offerId)
    }

    access(all) fun getOffer(offerId: UInt64): Offer? {
        return self.offers[offerId]
    }
}
