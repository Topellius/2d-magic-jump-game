const EnemyExpansion = {
    types: {
        basic: { hp: 30, damage: 10, xp: 10, speed: 2 },
        runner: { hp: 20, damage: 8, xp: 12, speed: 3.5 },
        jumper: { hp: 35, damage: 12, xp: 15, speed: 2 },
        mage: { hp: 25, damage: 15, xp: 18, speed: 1.5 },
        shield: { hp: 60, damage: 12, xp: 22, speed: 1 }
    },
    getScaling(level) {
        const scaleHp = 1 + Math.min((level - 1) * 0.03, 0.60);
        const scaleDmg = 1 + Math.min((level - 1) * 0.02, 0.40);
        return { hp: scaleHp, damage: scaleDmg };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnemyExpansion;
}
