access(all) contract SMS2FlowStaking {
    access(all) event Staked(walletId: String, amount: UFix64)
    access(all) event Unstaked(walletId: String, amount: UFix64)
    access(all) event RewardAccrued(walletId: String, amount: UFix64)

    access(self) var stakedBalances: {String: UFix64}
    access(self) var rewardBalances: {String: UFix64}

    init() {
        self.stakedBalances = {}
        self.rewardBalances = {}
    }

    access(all) fun stake(walletId: String, amount: UFix64) {
        pre {
            walletId.length > 0: "walletId cannot be empty"
            amount > 0.0: "amount must be positive"
        }

        let current = self.stakedBalances[walletId] ?? 0.0
        self.stakedBalances[walletId] = current + amount
        emit Staked(walletId: walletId, amount: amount)
    }

    access(all) fun accrueReward(walletId: String, amount: UFix64) {
        pre {
            walletId.length > 0: "walletId cannot be empty"
            amount >= 0.0: "reward cannot be negative"
        }

        let current = self.rewardBalances[walletId] ?? 0.0
        self.rewardBalances[walletId] = current + amount
        emit RewardAccrued(walletId: walletId, amount: amount)
    }

    access(all) fun unstake(walletId: String, amount: UFix64) {
        pre {
            walletId.length > 0: "walletId cannot be empty"
            amount > 0.0: "amount must be positive"
            (self.stakedBalances[walletId] ?? 0.0) >= amount: "insufficient staked balance"
        }

        let current = self.stakedBalances[walletId] ?? 0.0
        self.stakedBalances[walletId] = current - amount
        emit Unstaked(walletId: walletId, amount: amount)
    }

    access(all) fun getStakedBalance(walletId: String): UFix64 {
        return self.stakedBalances[walletId] ?? 0.0
    }

    access(all) fun getRewardBalance(walletId: String): UFix64 {
        return self.rewardBalances[walletId] ?? 0.0
    }
}
