const Skills = {
    unlocked: {
        arcBurst: false,
        doubleJump: false,
        dash: false,
        barrier: false
    },
    checkMilestones(level) {
        if (level >= 5) this.unlocked.arcBurst = true;
        if (level >= 10) this.unlocked.doubleJump = true;
        if (level >= 15) this.unlocked.dash = true;
        if (level >= 20) this.unlocked.barrier = true;
    },
    reset() {
        for (let k in this.unlocked) {
            this.unlocked[k] = false;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Skills;
}
