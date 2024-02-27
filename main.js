let canvas = document.getElementById("scratch-card1");
let context = canvas.getContext("2d");
let popup = document.getElementById("popup");

const init = () => {
    let img = new Image();
    img.onload = function() {
        canvas.width = window.innerWidth; // Adjust canvas width to match window width
        canvas.height = window.innerHeight; // Adjust canvas height to match window height
        let x = (canvas.width - img.width) / 2; // Calculate x position to center the image
        let y = (canvas.height - img.height) / 2; // Calculate y position to center the image
        context.drawImage(img, x, y); // Draw image at calculated position
    };
    img.src = './images/Artboard 21.png';
}

let isHovering = false;

const scratch = (x, y) => {
    if (isHovering) {
        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        context.arc(x, y, 48, 0, 2 * Math.PI); // Increase the radius to make the brush bigger
        context.fill();

        // Check if 60% of the image has been scratched off
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;
        let totalPixels = pixels.length / 4; // Each pixel has 4 values (RGBA)

        let transparentPixels = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            let alpha = pixels[i + 3];
            if (alpha === 0) {
                transparentPixels++;
            }
        }

        let transparencyPercentage = (transparentPixels / totalPixels) * 100;
        if (transparencyPercentage >= 95) { // If more than 50% of the image is transparent
            popup.style.display = "block"; // Show the popup
        } else {
            popup.style.display = "none"; // Hide the popup if less than 50% of the image is transparent
        }
    }
};

canvas.addEventListener("mouseenter", () => {
    isHovering = true;
    canvas.addEventListener("mousemove", scratchOnHover);
});

canvas.addEventListener("mouseleave", () => {
    isHovering = false;
    canvas.removeEventListener("mousemove", scratchOnHover);
});

function scratchOnHover(event) {
    scratch(event.offsetX, event.offsetY);
}

// Touch event listeners
canvas.addEventListener("touchstart", (event) => {
    isHovering = true;
    event.preventDefault(); // Prevent default touch behavior
    scratchOnTouch(event);
});

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault(); // Prevent default touch behavior
    scratchOnTouch(event);
});

canvas.addEventListener("touchend", () => {
    isHovering = false;
});

function scratchOnTouch(event) {
    let touch = event.touches[0]; // Get the first touch
    let rect = canvas.getBoundingClientRect(); // Get the position of the canvas
    let x = touch.clientX - rect.left; // Calculate x position relative to the canvas
    let y = touch.clientY - rect.top; // Calculate y position relative to the canvas
    scratch(x, y);
}

window.addEventListener("resize", () => {
    init();
});

init();

// Reset button functionality
document.getElementById("resetButton").addEventListener("click", function() {
    location.reload(); // Reload the page
});

// Close button functionality
document.getElementById("closeButton").addEventListener("click", function() {
    window.close(); // Close the current window
});