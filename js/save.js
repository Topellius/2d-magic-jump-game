const SaveSystem = {
    saveKey: '2d_magic_jump_save_v1',
    save(progData, upgradeData, skillData, highestLevel) {
        const payload = {
            version: 1,
            progression: progData,
            upgrades: upgradeData,
            skills: skillData,
            highestCompletedLevel: highestLevel
        };
        try {
            localStorage.setItem(this.saveKey, JSON.stringify(payload));
            return true;
        } catch (e) {
            return false;
        }
    },
    load() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || parsed.version !== 1) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    },
    reset() {
        try {
            localStorage.removeItem(this.saveKey);
            return true;
        } catch (e) {
            return false;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
}
