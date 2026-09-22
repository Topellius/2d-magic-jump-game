class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = 'PLAYING';
        this.levelNumber = 1;
        this.score = 0;
        this.platforms = [];
        this.enemies = [];
        this.goal = null;
        this.worldWidth = 3000;
        this.player = null;
    }

    async init() {
        Debug.log("Initializing game...");
        if (window.location.pathname.includes('level2.html')) {
            this.levelNumber = 2;
        } else if (window.location.pathname.includes('level3.html')) {
            this.levelNumber = 3;
        } else {
            this.levelNumber = 1;
        }

        const levelData = await LevelLoader.loadLevel(this.levelNumber);
        this.worldWidth = levelData.worldWidth;
        Camera.worldWidth = this.worldWidth;
        this.platforms = levelData.platforms;
        this.enemies = levelData.enemies.map(e => new Enemy(e.x, e.y, e.type));
        this.goal = levelData.goal;

        this.player = new Player(100, 300);
        RespawnSystem.currentCheckpoint = { x: 100, y: 300, name: 'Start' };
        RespawnSystem.checkpoints = [
            { x: 100, y: 300, name: 'Start', active: true },
            { x: Math.floor(this.worldWidth * 0.4), y: 200, name: 'Checkpoint 1', active: false },
            { x: Math.floor(this.worldWidth * 0.75), y: 150, name: 'Checkpoint 2', active: false }
        ];

        this.setupUI();
        window.requestAnimationFrame(() => this.loop());
    }

    setupUI() {
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartFromCheckpoint());
        const goRestartBtn = document.getElementById('gameover-restart-btn');
        if (goRestartBtn) goRestartBtn.addEventListener('click', () => this.restartFromCheckpoint());
        const nextLevelBtn = document.getElementById('next-level-btn');
        if (nextLevelBtn) nextLevelBtn.addEventListener('click', () => this.advanceLevel());
    }

    restartFromCheckpoint() {
        RespawnSystem.respawnPlayer(this.player);
        this.state = 'PLAYING';

Game.prototype.update = function() {
    if (Input.isPausePressed()) {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('pause-overlay').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            document.getElementById('pause-overlay').classList.add('hidden');
        }
    }

    if (this.state === 'PAUSED') return;

    if (this.player.isDead) {
        this.state = 'PLAYER_DEAD';
        document.getElementById('gameover-overlay').classList.remove('hidden');
        if (Input.isJumpPressed() || Input.isMeleePressed() || Input.keys['KeyR']) {
            this.restartFromCheckpoint();
        }
        return;
    }

    if (this.state === 'LEVEL_COMPLETE') return;

    this.player.update(this.platforms, this.enemies);
    Camera.update(this.player);
    RespawnSystem.update(this.player);

    for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update(this.platforms, this.player);
    }

    MagicSystem.update(this.enemies);
    Combat.checkMelee(this.player, this.enemies);

    for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].isDead && !this.enemies[i].scored) {
            this.enemies[i].scored = true;
            this.score += 100;
        }
    }

    if (this.goal && Collision.rectIntersect(this.player, this.goal)) {
        this.state = 'LEVEL_COMPLETE';
        document.getElementById('win-overlay').classList.remove('hidden');
    }

    this.updateHUD();
};

Game.prototype.updateHUD = function() {
    document.getElementById('hud-hp').innerText = `HP: ${Math.max(0, this.player.hp)}/${this.player.maxHp}`;
    document.getElementById('hud-score').innerText = `Score: ${this.score}`;
    document.getElementById('hud-level').innerText = `Level: ${this.levelNumber}`;
    const cdText = MagicSystem.cooldownTimer === 0 ? 'Ready' : `${(MagicSystem.cooldownTimer / 60).toFixed(1)}s`;
    document.getElementById('hud-cooldown').innerText = `Magic CD: ${cdText}`;
};

Game.prototype.render = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#334155';
    for (let i = 0; i < this.platforms.length; i++) {
        const p = this.platforms[i];
        this.ctx.fillRect(p.x - Camera.x, p.y, p.width, p.height);
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(p.x - Camera.x, p.y, p.width, 4);
        this.ctx.fillStyle = '#334155';
    }

    RespawnSystem.render(this.ctx, Camera.x);

    if (this.goal) {
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillRect(this.goal.x - Camera.x, this.goal.y, this.goal.width, this.goal.height);
        this.ctx.fillStyle = '#6ee7b7';
        this.ctx.fillRect(this.goal.x - Camera.x + 10, this.goal.y + 10, this.goal.width - 20, this.goal.height - 20);
    }

    for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].render(this.ctx, Camera.x);
    }

    MagicSystem.render(this.ctx, Camera.x);
    this.player.render(this.ctx, Camera.x);
};

Game.prototype.loop = function() {
    this.update();
    this.render();
    window.requestAnimationFrame(() => this.loop());
};

window.addEventListener('load', () => {
    const game = new Game();
    game.init();
});

        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('gameover-overlay').classList.add('hidden');
    }

    advanceLevel() {
        if (this.levelNumber === 1) window.location.href = 'level2.html';
        else if (this.levelNumber === 2) window.location.href = 'level3.html';
        else window.location.href = 'index.html';
    }
}
