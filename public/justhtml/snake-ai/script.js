const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Config
const CELL_SIZE = 20;
const GRID_SIZE = 30; // 600px / 20px
const COLORS = {
    bg: '#000000',
    grid: '#111111',
    p1: '#3b82f6',
    p2: '#ef4444',
    food: '#eab308'
};

// State
let snakes = [];
let food = null;
let gameInterval = null;
let isRunning = false;
let gameMode = 'solo'; // solo, pva, ava
let speed = 5;

// DOM Elements
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const status1El = document.getElementById('status1');
const status2El = document.getElementById('status2');
const startBtn = document.getElementById('startBtn');
const modeSelect = document.getElementById('gameMode');
const speedRange = document.getElementById('speedRange');
const speedVal = document.getElementById('speedVal');

// Setup Controls
modeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    resetGame();
});

speedRange.addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
    speedVal.textContent = speed + 'x';
});

startBtn.addEventListener('click', toggleGame);

document.addEventListener('keydown', handleInput);

function handleInput(e) {
    // Prevent scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    if (!isRunning && e.key === ' ') {
        toggleGame();
        return;
    }

    // Player controls (Snake 1)
    if (gameMode === 'pva' && snakes[0] && !snakes[0].isAi) {
        const snake = snakes[0];
        switch(e.key) {
            case 'ArrowUp': 
                if (snake.dir.y === 0) snake.nextDir = {x: 0, y: -1}; 
                break;
            case 'ArrowDown': 
                if (snake.dir.y === 0) snake.nextDir = {x: 0, y: 1}; 
                break;
            case 'ArrowLeft': 
                if (snake.dir.x === 0) snake.nextDir = {x: -1, y: 0}; 
                break;
            case 'ArrowRight': 
                if (snake.dir.x === 0) snake.nextDir = {x: 1, y: 0}; 
                break;
        }
    }
}

class Snake {
    constructor(id, startX, startY, color, isAi = false) {
        this.id = id;
        this.body = [
            {x: startX, y: startY},
            {x: startX, y: startY + 1},
            {x: startX, y: startY + 2}
        ];
        this.dir = {x: 0, y: -1}; // Moving up initially
        this.nextDir = {x: 0, y: -1};
        this.color = color;
        this.isAi = isAi;
        this.dead = false;
        this.score = 0;
        this.growPending = 0;
    }

    update() {
        if (this.dead) return;

        // AI Logic
        if (this.isAi) {
            const move = getBestMove(this, snakes, food);
            if (move) {
                this.nextDir = move;
            }
        }

        this.dir = this.nextDir;

        const head = this.body[0];
        const newHead = {
            x: head.x + this.dir.x,
            y: head.y + this.dir.y
        };

        // Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            this.die();
            return;
        }

        // Self Collision & Other Snake Collision
        for (const s of snakes) {
            if (s.dead) continue;
            for (let i = 0; i < s.body.length; i++) {
                if (newHead.x === s.body[i].x && newHead.y === s.body[i].y) {
                    // Head-to-head collision? Both die
                    if (i === 0 && s !== this) {
                        s.die();
                    }
                    this.die();
                    return;
                }
            }
        }

        this.body.unshift(newHead);

        // Check Food
        if (newHead.x === food.x && newHead.y === food.y) {
            this.score += 10;
            this.growPending += 1;
            placeFood();
        }

        if (this.growPending > 0) {
            this.growPending--;
        } else {
            this.body.pop();
        }
    }

    die() {
        this.dead = true;
    }
}

function initGame() {
    snakes = [];
    
    // Setup based on mode
    if (gameMode === 'solo') {
        snakes.push(new Snake(1, 15, 15, COLORS.p1, true));
        status2El.textContent = "Disabled";
    } else if (gameMode === 'pva') {
        snakes.push(new Snake(1, 5, 15, COLORS.p1, false)); // Player
        snakes.push(new Snake(2, 24, 15, COLORS.p2, true));  // AI
    } else if (gameMode === 'ava') {
        snakes.push(new Snake(1, 5, 15, COLORS.p1, true));  // AI 1
        snakes.push(new Snake(2, 24, 15, COLORS.p2, true)); // AI 2
    }

    placeFood();
    updateUI();
    draw();
}

function placeFood() {
    let valid = false;
    let attempts = 0;
    while (!valid && attempts < 100) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        valid = true;
        // Check overlap with snakes
        for (const s of snakes) {
            for (const part of s.body) {
                if (part.x === food.x && part.y === food.y) {
                    valid = false;
                    break;
                }
            }
        }
        attempts++;
    }
}

function updateUI() {
    score1El.textContent = snakes[0] ? snakes[0].score : 0;
    status1El.textContent = snakes[0] ? (snakes[0].dead ? "Dead" : "Alive") : "-";
    
    if (snakes[1]) {
        score2El.textContent = snakes[1].score;
        status2El.textContent = snakes[1].dead ? "Dead" : "Alive";
        status2El.style.color = snakes[1].dead ? '#ef4444' : '#22c55e';
    } else {
        score2El.textContent = 0;
        status2El.textContent = "Disabled";
        status2El.style.color = '#555';
    }
    
    status1El.style.color = snakes[0] && snakes[0].dead ? '#ef4444' : '#22c55e';
}

function toggleGame() {
    if (isRunning) {
        isRunning = false;
        startBtn.textContent = "Resume";
        cancelAnimationFrame(gameInterval);
    } else {
        if (snakes.every(s => s.dead) || snakes.length === 0) {
            initGame();
        }
        isRunning = true;
        startBtn.textContent = "Pause";
        lastTime = 0;
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    isRunning = false;
    startBtn.textContent = "Start Game";
    cancelAnimationFrame(gameInterval);
    initGame();
}

let lastTime = 0;
function gameLoop(timestamp) {
    if (!isRunning) return;

    // Control game speed
    // Speed 1: ~500ms, Speed 5: ~100ms, Speed 10: ~50ms
    const interval = 500 / Math.pow(1.5, speed - 1);
    
    if (timestamp - lastTime > interval) {
        update();
        draw();
        lastTime = timestamp;
    }

    gameInterval = requestAnimationFrame(gameLoop);
}

function update() {
    let allDead = true;
    snakes.forEach(s => {
        s.update();
        if (!s.dead) allDead = false;
    });

    updateUI();

    if (allDead) {
        isRunning = false;
        startBtn.textContent = "Game Over - Restart";
        cancelAnimationFrame(gameInterval);
    }
}

function draw() {
    // Clear
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    if (food) {
        ctx.fillStyle = COLORS.food;
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE/2, 
            food.y * CELL_SIZE + CELL_SIZE/2, 
            CELL_SIZE/2 - 2, 
            0, Math.PI * 2
        );
        ctx.fill();
        ctx.shadowColor = COLORS.food;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Snakes
    snakes.forEach(snake => {
        if (snake.dead) {
            ctx.globalAlpha = 0.3;
        }
        ctx.fillStyle = snake.color;
        
        snake.body.forEach((part, index) => {
            // Head
            if (index === 0) {
                ctx.fillStyle = '#ffffff'; 
                ctx.fillRect(part.x * CELL_SIZE, part.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.fillStyle = snake.color;
                // Eyes
                ctx.fillStyle = 'black';
                const eyeSize = 4;
                ctx.fillRect(part.x * CELL_SIZE + 5, part.y * CELL_SIZE + 5, eyeSize, eyeSize);
                ctx.fillRect(part.x * CELL_SIZE + 11, part.y * CELL_SIZE + 5, eyeSize, eyeSize);
                ctx.fillStyle = snake.color;
            } else {
                ctx.fillRect(part.x * CELL_SIZE + 1, part.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
        });
        ctx.globalAlpha = 1.0;
    });
}


// ==========================================
// AI LOGIC
// ==========================================

function getBestMove(snake, allSnakes, food) {
    const head = snake.body[0];
    const moves = [
        {x: 0, y: -1}, // Up
        {x: 0, y: 1},  // Down
        {x: -1, y: 0}, // Left
        {x: 1, y: 0}   // Right
    ];

    // Filter out immediate death
    const safeMoves = moves.filter(move => {
        // Prevent 180 turn
        if (move.x === -snake.dir.x && move.y === -snake.dir.y) return false;
        
        const nextX = head.x + move.x;
        const nextY = head.y + move.y;
        return isSafe(nextX, nextY, allSnakes);
    });

    if (safeMoves.length === 0) return snake.dir; // Die

    let moveScores = safeMoves.map(move => {
        const nextPos = {x: head.x + move.x, y: head.y + move.y};
        const path = bfs(nextPos, food, allSnakes);
        
        if (path) {
            // Found a path to food.
            // But is it safe? Check if we can survive after reaching that step?
            // Advanced: Check if reachable space after move is > body length
            return { move, score: path.length, type: 'food' };
        } else {
            // No path to food? Try to survive.
            const space = floodFill(nextPos, allSnakes);
            return { move, score: -space, type: 'survival' };
        }
    });

    // Sort: Food (shortest) -> Survival (largest space)
    moveScores.sort((a, b) => {
        if (a.type === 'food' && b.type === 'survival') return -1;
        if (a.type === 'survival' && b.type === 'food') return 1;
        return a.score - b.score;
    });

    return moveScores[0].move;
}

function isSafe(x, y, allSnakes) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;

    for (const s of allSnakes) {
        if (s.dead) continue;
        for (const part of s.body) {
            if (x === part.x && y === part.y) return false;
        }
    }
    return true;
}

function bfs(start, target, allSnakes) {
    const queue = [{pos: start, path: []}];
    const visited = new Set();
    visited.add(start.x + ',' + start.y);

    const obstacleMap = new Set();
    for (const s of allSnakes) {
        if (s.dead) continue;
        for (const part of s.body) {
            obstacleMap.add(part.x + ',' + part.y);
        }
    }

    while (queue.length > 0) {
        const {pos, path} = queue.shift();

        if (pos.x === target.x && pos.y === target.y) {
            return path;
        }

        const dirs = [
            {x: 0, y: -1}, {x: 0, y: 1}, 
            {x: -1, y: 0}, {x: 1, y: 0}
        ];

        for (const dir of dirs) {
            const next = {x: pos.x + dir.x, y: pos.y + dir.y};
            const key = next.x + ',' + next.y;

            if (
                next.x >= 0 && next.x < GRID_SIZE &&
                next.y >= 0 && next.y < GRID_SIZE &&
                !visited.has(key) &&
                !obstacleMap.has(key)
            ) {
                visited.add(key);
                queue.push({
                    pos: next, 
                    path: [...path, dir]
                });
            }
        }
    }
    return null;
}

function floodFill(start, allSnakes) {
    const queue = [start];
    const visited = new Set();
    visited.add(start.x + ',' + start.y);
    let count = 0;

    const obstacleMap = new Set();
    for (const s of allSnakes) {
        if (s.dead) continue;
        for (const part of s.body) {
            obstacleMap.add(part.x + ',' + part.y);
        }
    }

    while (queue.length > 0) {
        const pos = queue.shift();
        count++;

        const dirs = [
            {x: 0, y: -1}, {x: 0, y: 1}, 
            {x: -1, y: 0}, {x: 1, y: 0}
        ];

        for (const dir of dirs) {
            const next = {x: pos.x + dir.x, y: pos.y + dir.y};
            const key = next.x + ',' + next.y;

            if (
                next.x >= 0 && next.x < GRID_SIZE &&
                next.y >= 0 && next.y < GRID_SIZE &&
                !visited.has(key) &&
                !obstacleMap.has(key)
            ) {
                visited.add(key);
                queue.push(next);
            }
        }
    }
    return count;
}

// Start
initGame();
draw();
