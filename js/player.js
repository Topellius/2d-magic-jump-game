class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.jumpForce = -12;
        this.isGrounded = false;
        this.isCrouching = false;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.facing = 'right';
        this.hp = 100;
        this.maxHp = 100;
        this.isDead = false;
        this.hitFlashTimer = 0;
    }

    update(platforms, enemies) {
        if (this.isDead) return;

        if (this.hitFlashTimer > 0) this.hitFlashTimer--;

        // Horizontal movement
        this.vx = 0;
        if (Input.isLeftPressed()) {
            this.vx = -this.speed;
            this.facing = 'left';
        }
        if (Input.isRightPressed()) {
            this.vx = this.speed;
            this.facing = 'right';
        }

        // Crouch
        if (Input.isCrouchPressed()) {
            if (!this.isCrouching) {
                this.isCrouching = true;
                this.height = 30;
                this.y += 18;
            }
        } else {
            if (this.isCrouching) {
                this.isCrouching = false;
                this.y -= 18;
                this.height = 48;
            }
        }

        // Jump
        if (Input.isJumpPressed() && this.isGrounded && !this.isCrouching) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
        }

        // Melee attack
        if (Input.isMeleePressed() && !this.isAttacking) {
            this.isAttacking = true;
            this.attackTimer = 12; // active for 12 frames
        }

        if (this.isAttacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }

        // Magic casts
        if (Input.isForwardMagicPressed()) {
            MagicSystem.castForward(this);
        }
        if (Input.isSkyMagicPressed()) {
            MagicSystem.castSky(this, this.x + (this.facing === 'right' ? 150 : -150));
        }

        // Apply physics & collision
        Physics.update(this, platforms);
        Collision.resolveEntityPlatforms(this, platforms);

        // Fall death boundary
        if (this.y > 500) {
            this.takeDamage(100);
        }
    }

    takeDamage(amount) {
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

        // Render player body
        ctx.fillStyle = this.hitFlashTimer > 0 ? '#ffffff' : '#6366f1';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);

        // Direction indicator (eyes / headband)
        ctx.fillStyle = '#f43f5e';
        const eyeX = this.facing === 'right' ? this.x - cameraX + 20 : this.x - cameraX + 6;
        ctx.fillRect(eyeX, this.y + 10, 6, 6);

        // Melee attack visual cue
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(244, 63, 94, 0.6)';
            const swordX = this.facing === 'right' ? this.x - cameraX + this.width : this.x - cameraX - 40;
            ctx.fillRect(swordX, this.y + 10, 40, 20);
        }
    }
}
