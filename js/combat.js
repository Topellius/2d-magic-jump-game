const Combat = {
    checkMelee(player, enemies) {
        if (!player.isAttacking) return;
        const attackBox = {
            x: player.facing === 'right' ? player.x + player.width : player.x - 40,
            y: player.y,
            width: 40,
            height: player.height
        };
        for (const enemy of enemies) {
            if (enemy.isDead) continue;
            if (Collision.rectIntersect(attackBox, enemy)) {
                enemy.takeDamage(20, 'player', 'melee');
            }
        }
    }
};
