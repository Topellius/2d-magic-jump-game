class Enemy {
    constructor(x, y, type = 'patrol') {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 42;
        this.vx = type === 'patrol' ? 1.5 : 2;
        this.vy = 0;
        this.isGrounded = false;
        this.hp = 60;
        this.maxHp = 60;
        this.isDead = false;
        this.type = type;
        this.patrolMin = x - 120;
        this.patrolMax = x + 120;
        this.state = 'PATROL';
        this.hitFlashTimer = 0;
    }

    update(platforms, player) {
        if (this.isDead) return;

        if (this.hitFlashTimer > 0) this.hitFlashTimer--;

        // AI behavior
        if (this.type === 'patrol') {
            this.x += this.vx;
            if (this.x < this.patrolMin || this.x > this.patrolMax) {
                this.vx *= -1;
            }
        } else if (this.type === 'chase') {
            // Chase player if within range
            const dist = player.x - this.x;
            if (Math.abs(dist) < 250) {
                this.state = 'CHASE';
                this.vx = dist > 0 ? 2 : -2;
            } else {
                this.state = 'PATROL';
                this.x += this.vx;
                if (this.x < this.patrolMin || this.x > this.patrolMax) {
                    this.vx *= -1;
                }
            }
            this.x += this.vx;
        }

        // Apply gravity & platform collisions
        Physics.update(this, platforms);
        Collision.resolveEntityPlatforms(this, platforms);

        // Check collision with player damaging player
        if (!player.isDead && Collision.rectIntersect(this, player)) {
            player.takeDamage(15);
        }
    }

    takeDamage(amount, source, type) {
        if (this.isDead) return;
        this.hp -= amount;
        this.hitFlashTimer = 15;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
        }
    }

    render(ctx, cameraX) {
        if (this.isDead) return;
        ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : (this.type === 'chase' ? '#f43f5e' : '#fb923c');
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);

        // Eyes
        ctx.fillStyle = '#0f172a';
        const eyeOffset = this.vx > 0 ? 24 : 6;
        ctx.fillRect(this.x - cameraX + eyeOffset, this.y + 10, 6, 6);

        // HP bar above enemy
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.x - cameraX, this.y - 10, this.width, 5);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(this.x - cameraX, this.y - 10, this.width * (this.hp / this.maxHp), 5);
    }
}
