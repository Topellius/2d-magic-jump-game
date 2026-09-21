const LevelLoader = {
    async loadLevel(levelNum) {
        // Returns level config or structured data
        const levels = {
            1: {
                worldWidth: 3000,
                platforms: [
                    { x: 0, y: 400, width: 3000, height: 50, vyOffset: 0 },
                    { x: 400, y: 310, width: 200, height: 20, vyOffset: 0 },
                    { x: 750, y: 240, width: 220, height: 20, vyOffset: 0 },
                    { x: 1100, y: 280, width: 250, height: 20, vyOffset: 0 },
                    { x: 1450, y: 200, width: 200, height: 20, vyOffset: 0 },
                    { x: 1800, y: 310, width: 220, height: 20, vyOffset: 0 },
                    { x: 2150, y: 230, width: 250, height: 20, vyOffset: 0 },
                    { x: 2600, y: 350, width: 300, height: 50, vyOffset: 0 }
                ],
                enemies: [
                    { x: 500, y: 350, type: 'patrol' },
                    { x: 850, y: 190, type: 'patrol' },
                    { x: 1200, y: 230, type: 'chase' },
                    { x: 1550, y: 150, type: 'patrol' },
                    { x: 1900, y: 260, type: 'chase' },
                    { x: 2250, y: 180, type: 'patrol' }
                ],
                goal: { x: 2800, y: 300, width: 50, height: 100 }
            },
            2: {
                worldWidth: 3200,
                platforms: [
                    { x: 0, y: 400, width: 3200, height: 50, vyOffset: 0 },
                    { x: 300, y: 300, width: 180, height: 20, vyOffset: 0 },
                    { x: 650, y: 220, width: 180, height: 20, vyOffset: 0 },
                    { x: 1000, y: 280, width: 200, height: 20, vyOffset: 0 },
                    { x: 1350, y: 190, width: 220, height: 20, vyOffset: 0 },
                    { x: 1750, y: 270, width: 200, height: 20, vyOffset: 0 },
                    { x: 2100, y: 180, width: 220, height: 20, vyOffset: 0 },
                    { x: 2500, y: 250, width: 200, height: 20, vyOffset: 0 },
                    { x: 2900, y: 350, width: 300, height: 50, vyOffset: 0 }
                ],
                enemies: [
                    { x: 350, y: 250, type: 'chase' },
                    { x: 700, y: 170, type: 'patrol' },
                    { x: 1100, y: 230, type: 'chase' },
                    { x: 1450, y: 140, type: 'patrol' },
                    { x: 1850, y: 220, type: 'chase' },
                    { x: 2200, y: 130, type: 'chase' },
                    { x: 2600, y: 200, type: 'patrol' }
                ],
                goal: { x: 3050, y: 300, width: 50, height: 100 }
            },
            3: {
                worldWidth: 3500,
                platforms: [
                    { x: 0, y: 400, width: 3500, height: 50, vyOffset: 0 },
                    { x: 250, y: 310, width: 150, height: 20, vyOffset: 0 },
                    { x: 550, y: 230, width: 160, height: 20, vyOffset: 0 },
                    { x: 850, y: 160, width: 160, height: 20, vyOffset: 0 },
                    { x: 1200, y: 250, width: 180, height: 20, vyOffset: 0 },
                    { x: 1550, y: 180, width: 180, height: 20, vyOffset: 0 },
                    { x: 1900, y: 270, width: 180, height: 20, vyOffset: 0 },
                    { x: 2250, y: 190, width: 180, height: 20, vyOffset: 0 },
                    { x: 2650, y: 260, width: 180, height: 20, vyOffset: 0 },
                    { x: 3100, y: 350, width: 400, height: 50, vyOffset: 0 }
                ],
                enemies: [
                    { x: 300, y: 260, type: 'chase' },
                    { x: 600, y: 180, type: 'chase' },
                    { x: 900, y: 110, type: 'patrol' },
                    { x: 1300, y: 200, type: 'chase' },
                    { x: 1650, y: 130, type: 'chase' },
                    { x: 2000, y: 220, type: 'patrol' },
                    { x: 2350, y: 140, type: 'chase' },
                    { x: 2800, y: 210, type: 'chase' }
                ],
                goal: { x: 3350, y: 300, width: 50, height: 100 }
            }
        };
        return levels[levelNum] || levels[1];
    }
};
