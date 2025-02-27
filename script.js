let highestZ = 1;
class Paper {
    holdingPaper = false;
    touchMode = false;
    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;
    prevX = 0;
    prevY = 0;
    rotation = Math.random() * 30 - 15;
    rotating = false;

    init(paper) {
        // Prevent iOS scrolling while dragging
        document.body.style.overscrollBehavior = "none";

        // Handles movement (Mouse & Touch)
        const moveHandler = (e) => {
            e.preventDefault(); // Prevents scrolling

            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            if (!this.rotating) {
                this.currentX += clientX - this.prevX;
                this.currentY += clientY - this.prevY;
            } else {
                const dx = clientX - this.startX;
                const dy = clientY - this.startY;
                this.rotation = Math.atan2(dy, dx) * (180 / Math.PI);
            }

            paper.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
            this.prevX = clientX;
            this.prevY = clientY;
        };

        // Starts dragging or rotating
        const startHandler = (e) => {
            this.holdingPaper = true;
            this.touchMode = !!e.touches;
            paper.style.zIndex = highestZ++;
            e.preventDefault(); // Prevent default touch behavior

            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            this.startX = clientX;
            this.startY = clientY;
            this.prevX = clientX;
            this.prevY = clientY;

            // Two fingers = rotate mode
            this.rotating = e.touches && e.touches.length > 1;
        };

        // Stops dragging/rotating
        const stopHandler = () => {
            this.holdingPaper = false;
            this.rotating = false;
        };

        // Attach event listeners with { passive: false } for iOS support
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("touchmove", moveHandler, { passive: false });

        paper.addEventListener("mousedown", startHandler);
        paper.addEventListener("touchstart", startHandler, { passive: false });

        window.addEventListener("mouseup", stopHandler);
        window.addEventListener("touchend", stopHandler);
    }
}

// Initialize all papers
document.querySelectorAll(".paper").forEach(paper => {
    const p = new Paper();
    p.init(paper);
});

// Handle Yes/No Buttons
const noButton = document.getElementById("no-btn");
const yesButton = document.getElementById("yes-btn");
const popup = document.getElementById("popup");

// "No" button moves on hover (desktop), stays fixed on mobile
noButton.addEventListener("mouseover", () => {
    if (window.innerWidth > 768) {
        noButton.style.position = "absolute";
        noButton.style.left = Math.random() * 80 + "vw";
        noButton.style.top = Math.random() * 80 + "vh";
    }
});

// "Yes" button shows the popup
yesButton.addEventListener("click", () => {
    popup.style.display = "block";
});

// Hide popup initially
popup.style.display = "none";
