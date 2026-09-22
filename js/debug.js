const Debug = {
    enabled: true,
    log(msg) {
        if (this.enabled) {
            console.log(`[GAME DEBUG]: ${msg}`);
        }
    }
};
