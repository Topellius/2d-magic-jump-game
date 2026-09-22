const Input = {
    keys: {},
    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyZ', 'KeyX', 'KeyC', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    },
    isDown(code) {
        return !!this.keys[code];
    },
    isLeftPressed() {
        return this.isDown('ArrowLeft') || this.isDown('KeyA');
    },
    isRightPressed() {
        return this.isDown('ArrowRight') || this.isDown('KeyD');
    },
    isJumpPressed() {
        return this.isDown('ArrowUp') || this.isDown('KeyW') || this.isDown('Space');
    },
    isCrouchPressed() {
        return this.isDown('ArrowDown') || this.isDown('KeyS');
    },
    isMeleePressed() {
        return this.isDown('KeyZ') || this.isDown('KeyJ');
    },
    isForwardMagicPressed() {
        return this.isDown('KeyX') || this.isDown('KeyK');
    },
    isSkyMagicPressed() {
        return this.isDown('KeyC') || this.isDown('KeyL');
    },
    isPausePressed() {
        return this.isDown('Escape') || this.isDown('KeyP');
    }
};
Input.init();
