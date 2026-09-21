const Camera = {
    x: 0,
    width: 800,
    worldWidth: 3000,
    update(player) {
        // Center camera on player
        this.x = player.x - this.width / 2 + player.width / 2;
        // Clamp to world bounds
        if (this.x < 0) this.x = 0;
        if (this.x > this.worldWidth - this.width) {
            this.x = this.worldWidth - this.width;
        }
    }
};
