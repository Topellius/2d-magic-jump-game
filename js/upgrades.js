const Upgrades = {
    catalog: {
        vitality: { name: 'VITALITY', desc: '+10 maximum HP', cap: 20 },
        meleePower: { name: 'MELEE_POWER', desc: '+10% melee damage', cap: 10 },
        magicPower: { name: 'MAGIC_POWER', desc: '+10% magic damage', cap: 10 },
        moveSpeed: { name: 'MOVE_SPEED', desc: '+4% movement speed', cap: 5 }, // +20% total
        jumpPower: { name: 'JUMP_POWER', desc: '+3% jump strength', cap: 5 }, // +15% total
        cooldown: { name: 'COOLDOWN', desc: '-5% magic cooldown duration', cap: 6 }, // -30% total
        projectileSpeed: { name: 'PROJECTILE_SPEED', desc: '+8% forward-magic projectile speed', cap: 5 }, // +40% total
        checkpointRecovery: { name: 'CHECKPOINT_RECOVERY', desc: '+10 HP restored on checkpoint', cap: 5 }
    },
    owned: {
        vitality: 0,
        meleePower: 0,
        magicPower: 0,
        moveSpeed: 0,
        jumpPower: 0,
        cooldown: 0,
        projectileSpeed: 0,
        checkpointRecovery: 0
    },
    getRandomChoices(count = 3) {
        const keys = Object.keys(this.catalog).filter(k => this.owned[k] < this.catalog[k].cap);
        const shuffled = keys.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    applyUpgrade(key) {
        if (this.owned[key] !== undefined && this.owned[key] < this.catalog[key].cap) {
            this.owned[key]++;
            return true;
        }
        return false;
    },
    reset() {
        for (let k in this.owned) {
            this.owned[k] = 0;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Upgrades;
}
