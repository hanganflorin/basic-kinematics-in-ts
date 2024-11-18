// Get the canvas and its context
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// get button
const toggleTimerBtn = document.getElementById('toggleTimer');

// Canvas size
const width = canvas.width;
const height = canvas.height;
console.log('# Canvas size', { width, height });

// Initial axis system settings
// let originX = width / 2;
// let originY = height / 2;

let originX = 50;
let originY = height - 50;

// let scale = 40; // 1 unit = 40 pixels initially
// let scale = 25;
let scale = 16;

console.log('# Initial sizes', { originX, originY, scale });

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

// Function to draw grid
function drawGrid() {
    ctx.beginPath();

    // Draw vertical grid lines
    for (let x = originX % scale; x < width; x += scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }

    // Draw horizontal grid lines
    for (let y = originY % scale; y < height; y += scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }

    ctx.strokeStyle = '#ddd';
    ctx.stroke();
}

// Function to draw axes
function drawAxes() {
    ctx.beginPath();

    // X axis
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);

    // Y axis
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw numbers on the axes
    const drawNumberFn = (value: number, x: number, y: number) => {
        ctx.fillText(value.toFixed(scale < 100 ? 0 : 1).toString(), x, y);
    };

    ctx.fillStyle = '#9c9c9c';
    ctx.font = '14px Arial';

    // draw numbers on x axis
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const firstNumberX = Math.floor(-originX / scale) + 1;
    const lastNumberX = Math.ceil((width - originX) / scale) - 1;
    for (let i = firstNumberX; i <= lastNumberX; i++) {
        if (i === 0) {
            continue;
        }
        drawNumberFn(i, i * scale + originX, originY + scale * 0.3);
    }

    // draw numbers on y axis
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const firstNumberY = Math.floor(-originY / scale) + 1;
    const lastNumberY = Math.ceil((height - originY) / scale) - 1;
    for (let i = firstNumberY; i <= lastNumberY; i++) {
        if (i === 0) {
            continue;
        }
        drawNumberFn(-i, originX - scale * 0.3, i * scale + originY);
    }
}

// Mouse events for dragging
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if the mouse is on the axes to start dragging
    // if (
    //     Math.abs(mouseX - originX) < scale &&
    //     Math.abs(mouseY - originY) < scale
    // ) {
    isDragging = true;
    dragStartX = mouseX - originX;
    dragStartY = mouseY - originY;
    // }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        console.log('!!! mousemove & isDragging', { mouseX, mouseY });

        originX = mouseX - dragStartX;
        originY = mouseY - dragStartY;

        // Redraw the canvas
        redraw();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Zoom functionality
canvas.addEventListener('wheel', (e) => {
    const scaleMultiplier = 1.01;
    if (e.deltaY < 0) {
        // Zoom in (less sensitive)
        scale *= scaleMultiplier;
    } else {
        // Zoom out (less sensitive)
        scale /= scaleMultiplier;
    }

    console.log('!!! ON wheel', { scale });

    // Redraw with the new scale
    redraw();
    e.preventDefault(); // Prevent page scroll
});

const pointToCanvasPosition = (x: number, y: number) => {
    return {
        x: x * scale + originX,
        y: -y * scale + originY,
    };
};

const drawCircle = (x: number, y: number, radius: number) => {
    const pointPosition = pointToCanvasPosition(x, y);
    ctx.beginPath();
    ctx.arc(
        pointPosition.x,
        pointPosition.y,
        radius * scale * 0.1,
        0,
        2 * Math.PI
    );
    ctx.globalAlpha = 0.99;
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.globalAlpha = 1;
};

// // Animate gravity
// let xInitial = 2;
// let yInitial = 2;

const degToRad = Math.PI / 180;

const initialPosition = {
    x: 2.5,
    y: 2.5,
};

const initialAngle = 15; // TODOO this is reversed
const intialPower = 15;
const initialVelocity = {
    x: Math.cos(initialAngle * degToRad) * intialPower,
    y: Math.sin(initialAngle * degToRad) * intialPower,
};

let sperePosX = initialPosition.x;
let sperePosY = initialPosition.y;
const spereRadius = 5;

const KinematicEquation = (
    acceleration: number,
    initialVelocity: number,
    initialPosition: number,
    deltaTime: number
) => {
    return (
        0.5 * acceleration * deltaTime * deltaTime +
        initialVelocity * deltaTime +
        initialPosition
    );
};

function drawObjects() {
    drawCircle(sperePosX, sperePosY, spereRadius);
}

let time = 0;
let startTime = 0;
let elapsedTime = 0;
let prevElapsedTime = 0;
let isRunning = false;

function updateTimer() {
    if (isRunning) {
        const currentTime = performance.now();
        elapsedTime = (currentTime - startTime) / 1000;
        const deltaTime = elapsedTime - prevElapsedTime;
        prevElapsedTime = elapsedTime;
        // console.log(
        //     `Elapsed time: ${elapsedTime.toFixed(
        //         2
        //     )} seconds; Delta: ${deltaTime}`
        // ); // Log elapsed time

        // START HERE:

        const itHitTheGround = sperePosY - spereRadius * 0.1 <= 0;
        console.log('!!! itHitTheGround', itHitTheGround);

        if (!itHitTheGround) {
            sperePosY = KinematicEquation(
                -9.8,
                initialVelocity.x,
                initialPosition.x,
                elapsedTime
            );
        }

        sperePosX = KinematicEquation(
            0,
            initialVelocity.y,
            initialPosition.y,
            elapsedTime
        );

        redraw();

        requestAnimationFrame(updateTimer);
    }
}
if (isRunning) {
    updateTimer();
}

toggleTimerBtn?.addEventListener('click', () => {
    if (isRunning) {
        isRunning = false;
    } else {
        isRunning = true;
        startTime = performance.now() - elapsedTime * 1000; // Adjust startTime to maintain continuity
        requestAnimationFrame(updateTimer);
    }

    console.log('!!! isRunning', isRunning);
});

// Function to redraw everything
function redraw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawAxes();

    drawObjects();
}

// Initial drawing
redraw();
