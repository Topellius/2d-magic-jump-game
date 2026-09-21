const RespawnSystem = {
    currentCheckpoint: { x: 100, y: 300, name: 'Start' },
    checkpoints: [
        { x: 100, y: 300, name: 'Start', active: true },
        { x: 1100, y: 220, name: 'Checkpoint 1', active: false },
        { x: 2100, y: 150, name: 'Checkpoint 2', active: false }
    ],

    update(player) {
        for (const cp of this.checkpoints) {
            const cpBox = { x: cp.x, y: cp.y - 40, width: 30, height: 60 };
            if (!cp.active && Collision.rectIntersect(player, cpBox)) {
                cp.active = true;
                this.currentCheckpoint = cp;
                const cpElem = document.getElementById('hud-checkpoint');
                if (cpElem) cpElem.innerText = `Checkpoint: ${cp.name}`;
            }
        }
    },

    respawnPlayer(player) {
        player.x = this.currentCheckpoint.x;
        player.y = this.currentCheckpoint.y;
        player.vx = 0;
        player.vy = 0;
        player.hp = player.maxHp;
        player.isDead = false;
        player.state = 'RESPAWNING';
    },

    render(ctx, cameraX) {
        for (const cp of this.checkpoints) {
            ctx.fillStyle = cp.active ? '#10b981' : '#64748b';
            ctx.fillRect(cp.x - cameraX, cp.y - 40, 16, 50);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(cp.x - cameraX - 4, cp.y - 50, 24, 12);
        }
    }
};
