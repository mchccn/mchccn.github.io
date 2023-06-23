"use strict";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class RegularPolygon {
    x;
    y;
    n;
    radius;
    angle;
    constructor(x, y, n, radius = 1, angle = 0) {
        this.x = x;
        this.y = y;
        this.n = n;
        this.radius = radius;
        this.angle = angle;
    }
}
const polygons = Array.from({ length: 48 }, () => new RegularPolygon(Math.random() * canvas.width, Math.random() * canvas.height, Math.floor(Math.random() * 3 + 3), Math.random() * 75 + 50, Math.random() * 2 * Math.PI));
let show = localStorage.getItem("show") ?? true;
const toggle = document.querySelector("#toggle");
toggle.textContent = show ? "hide shapes" : "show shapes";
toggle.addEventListener("click", () => {
    show = !show;
    if (show)
        requestAnimationFrame(update);
    toggle.textContent = show ? "hide shapes" : "show shapes";
    localStorage.setItem("show", show ? "true" : "");
});
ctx.fillStyle = "white";
const dragged = [];
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!show)
        return;
    const polygonCount = Math.ceil(window.innerWidth * window.innerHeight / 100000 * 0.75);
    polygons.slice(0, polygonCount).forEach((polygon) => {
        const [start, ...vertices] = [...Array(polygon.n).keys()].map((i) => [
            polygon.x + Math.cos(polygon.angle + (2 * Math.PI / polygon.n * i)) * polygon.radius,
            polygon.y + Math.sin(polygon.angle + (2 * Math.PI / polygon.n * i)) * polygon.radius,
        ]);
        ctx.beginPath();
        ctx.moveTo(...start);
        for (const vertice of vertices)
            ctx.lineTo(...vertice);
        ctx.closePath();
        ctx.fill();
        polygon.angle += polygon.radius / 2500;
        polygon.y += polygon.radius / 15;
        if (dragged.includes(polygon)) {
            polygon.x = mouse.x;
            polygon.y = mouse.y;
        }
        if (polygon.y > canvas.height + polygon.radius) {
            polygon.x = Math.random() * canvas.width;
            polygon.n = Math.floor(Math.random() * 3 + 3);
            polygon.radius = Math.random() * 75 + 50;
            polygon.angle = Math.random() * 2 * Math.PI;
            polygon.y = -polygon.radius;
        }
    });
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
const mouse = { x: -1, y: -1, down: false };
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener("mousedown", () => {
    if (show)
        dragged.push(...polygons.filter((p) => Math.hypot(mouse.x - p.x, mouse.y - p.y) < p.radius));
});
window.addEventListener("mouseup", () => {
    dragged.length = 0;
});
