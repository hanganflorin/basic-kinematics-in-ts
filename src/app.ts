// Get the canvas and its context
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Canvas size
const width = canvas.width;
const height = canvas.height;

// Initial axis system settings
let originX = width / 2;
let originY = height / 2;
let scale = 40; // 1 unit = 40 pixels initially

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
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';

    // Draw X axis numbers
    for (let i = -width / 2; i <= width / 2; i += scale) {
        if (i !== 0) {
            const label = (i / scale).toFixed(1); // Limit to 1 decimal places
            ctx.fillText(label, originX + i, originY + 15);
        }
    }

    // Draw Y axis numbers
    for (let i = -height / 2; i <= height / 2; i += scale) {
        if (i !== 0) {
            const label = (i / scale).toFixed(1); // Limit to 1 decimal places
            ctx.fillText(label, originX + 5, originY + i);
        }
    }
}

// Mouse events for dragging
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if the mouse is on the axes to start dragging
    if (Math.abs(mouseX - originX) < 20 && Math.abs(mouseY - originY) < 20) {
        isDragging = true;
        dragStartX = mouseX - originX;
        dragStartY = mouseY - originY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

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
    const _scale = 1.005;
    if (e.deltaY < 0) {
        // Zoom in (less sensitive)
        scale *= _scale;
    } else {
        // Zoom out (less sensitive)
        scale /= _scale;
    }

    // Redraw with the new scale
    redraw();
    e.preventDefault(); // Prevent page scroll
});

// Function to redraw everything
function redraw() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawAxes();
}

// Initial drawing
redraw();
