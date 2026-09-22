const MagicSystem = {
    projectiles: [],
    skyAttacks: [],
    cooldownTimer: 0,
    skyCooldownTimer: 0,

    update(enemies) {
        if (this.cooldownTimer > 0) this.cooldownTimer--;
        if (this.skyCooldownTimer > 0) this.skyCooldownTimer--;

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.life--;
            // Check collision with enemies
            for (const enemy of enemies) {
                if (enemy.isDead) continue;
                if (Collision.rectIntersect(p, enemy)) {
                    enemy.takeDamage(p.damage, 'player', 'magic_forward');
                    p.life = 0;
                    break;
                }
            }
            if (p.life <= 0 || p.x < 0 || p.x > 3000) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update sky attacks
        for (let i = this.skyAttacks.length - 1; i >= 0; i--) {
            const s = this.skyAttacks[i];
            s.timer--;
            if (s.timer === 10) { // Strike frame
                for (const enemy of enemies) {
                    if (enemy.isDead) continue;
                    if (Collision.rectIntersect(s, enemy)) {
                        enemy.takeDamage(s.damage, 'player', 'magic_sky');
                    }
                }
            }
            if (s.timer <= 0) {
                this.skyAttacks.splice(i, 1);
            }
        }
    },

    castForward(player) {
        if (this.cooldownTimer > 0) return false;
        this.cooldownTimer = 30; // 0.5 sec at 60fps
        const vx = player.facing === 'right' ? 10 : -10;
        this.projectiles.push({
            x: player.facing === 'right' ? player.x + player.width : player.x - 20,
            y: player.y + player.height / 2 - 10,
            width: 20,
            height: 12,
            vx: vx,
            damage: 35,
            life: 60
        });
        return true;
    },

    castSky(player, targetX) {
        if (this.skyCooldownTimer > 0) return false;
        this.skyCooldownTimer = 60; // 1 sec cooldown
        this.skyAttacks.push({
            x: targetX - 25,
            y: 0,
            width: 50,
            height: 450,
            damage: 50,
            timer: 20 // lasts 20 frames
        });
        return true;
    },

    render(ctx, cameraX) {
        ctx.fillStyle = '#38bdf8';
        for (const p of this.projectiles) {
            ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#38bdf8';
            ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
            ctx.shadowBlur = 0;
        }

        ctx.fillStyle = '#c084fc';
        for (const s of this.skyAttacks) {
            if (s.timer > 10) {
                // Warning beam
                ctx.fillStyle = 'rgba(192, 132, 252, 0.3)';
                ctx.fillRect(s.x - cameraX, s.y, s.width, s.height);
            } else {
                // Active lightning strike
                ctx.fillStyle = '#e879f9';
                ctx.fillRect(s.x - cameraX + 15, s.y, 20, s.height);
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#e879f9';
                ctx.fillRect(s.x - cameraX + 15, s.y, 20, s.height);
                ctx.shadowBlur = 0;
            }
        }
    }
};
