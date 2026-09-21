const Progression = {
    level: 1,
    xp: 0,
    xpToNext(lvl) {
        return 100 + ((lvl - 1) * 50);
    },
    gainXp(amount) {
        this.xp += amount;
        let leveledUp = false;
        while (this.xp >= this.xpToNext(this.level)) {
            this.xp -= this.xpToNext(this.level);
            this.level++;
            leveledUp = true;
        }
        return leveledUp;
    },
    reset() {
        this.level = 1;
        this.xp = 0;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Progression;
}
