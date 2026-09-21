const Collision = {
    rectIntersect(r1, r2) {
        return r1.x < r2.x + r2.width &&
               r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height &&
               r1.y + r1.height > r2.y;
    },
    resolveEntityPlatforms(entity, platforms) {
        entity.isGrounded = false;
        for (const p of platforms) {
            // Check vertical collision
            if (entity.x + entity.width > p.x && entity.x < p.x + p.width) {
                // Landing on top
                if (entity.vy >= 0 && entity.y + entity.height <= p.y + p.vyOffset && entity.y + entity.height + entity.vy >= p.y) {
                    entity.y = p.y - entity.height;
                    entity.vy = 0;
                    entity.isGrounded = true;
                }
            }
        }
    }
};
