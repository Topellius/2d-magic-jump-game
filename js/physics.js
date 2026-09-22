const Physics = {
    gravity: 0.6,
    update(entity, platforms) {
        if (!entity.isGrounded) {
            entity.vy += this.gravity;
        }
        entity.x += entity.vx;
        entity.y += entity.vy;
    }
};
