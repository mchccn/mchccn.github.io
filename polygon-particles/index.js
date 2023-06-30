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
    heading;
    constructor(x, y, n, radius = 1, angle = 0, heading = Math.PI / 2) {
        this.x = x;
        this.y = y;
        this.n = n;
        this.radius = radius;
        this.angle = angle;
        this.heading = heading;
    }
    static random() {
        const radius = Math.random() * 75 + 50;
        const [x, y, heading] = [
            [Math.random() * canvas.width, -radius, Math.random() * Math.PI],
            [Math.random() * canvas.width, canvas.height + radius, Math.random() * -Math.PI],
            [-radius, Math.random() * canvas.height, Math.random() * Math.PI - Math.PI / 2],
            [canvas.width + radius, Math.random() * canvas.height, Math.random() * -Math.PI - Math.PI / 2],
        ][Math.floor(Math.random() * 4)];
        return new RegularPolygon(x, y, Math.floor(Math.random() * 3 + 3), Math.random() * 75 + 50, Math.random() * 2 * Math.PI, heading);
    }
}
const getPolygonCount = () => Math.ceil(((window.innerWidth * window.innerHeight) / 100000) * 0.75);
const polygons = Array.from({ length: 48 }, RegularPolygon.random);
let show = localStorage.getItem("show") ?? true;
const toggle = document.querySelector(".toggle");
toggle.textContent = show ? "hide shapes" : "show shapes";
document.querySelector("h1").style["-webkit-text-fill-color"] = show ? "" : "transparent";
toggle.addEventListener("click", () => {
    show = !show;
    if (show)
        requestAnimationFrame(update);
    toggle.textContent = show ? "hide shapes" : "show shapes";
    document.querySelector("h1").style["-webkit-text-fill-color"] = show ? "" : "transparent";
    localStorage.setItem("show", show ? "true" : "");
});
const dragged = [];
function update() {
    ctx.fillStyle = rave.on ? rave.colors[(Date.now() % (rave.colors.length * 100)) / 100 | 0] : "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!show)
        return;
    const polygonCount = getPolygonCount();
    polygons.slice(0, polygonCount).forEach((polygon) => {
        const [start, ...vertices] = [...Array(polygon.n).keys()].map((i) => [
            polygon.x + Math.cos(polygon.angle + ((2 * Math.PI) / polygon.n) * i) * polygon.radius,
            polygon.y + Math.sin(polygon.angle + ((2 * Math.PI) / polygon.n) * i) * polygon.radius,
        ]);
        ctx.beginPath();
        ctx.moveTo(...start);
        for (const vertice of vertices)
            ctx.lineTo(...vertice);
        ctx.closePath();
        ctx.fill();
        polygon.angle += polygon.radius / 2500;
        polygon.x += Math.cos(polygon.heading) * polygon.radius / 25;
        polygon.y += Math.sin(polygon.heading) * polygon.radius / 25;
        if (dragged.includes(polygon)) {
            polygon.x = mouse.x;
            polygon.y = mouse.y;
        }
        if (polygon.x < -polygon.radius ||
            polygon.x > canvas.width + polygon.radius ||
            polygon.y < -polygon.radius ||
            polygon.y > canvas.height + polygon.radius) {
            Object.assign(polygon, RegularPolygon.random());
        }
    });
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
const mouse = { x: -1, y: -1, dx: -1, dy: -1, down: false, idle: setTimeout(() => (document.body.style.cursor = "none"), 10 * 1000) };
window.addEventListener("mousemove", (e) => {
    document.body.style.cursor = "";
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    clearInterval(mouse.idle);
    mouse.idle = setTimeout(() => (document.body.style.cursor = "none"), 10 * 1000);
});
window.addEventListener("mousedown", (e) => {
    mouse.dx = e.clientX;
    mouse.dy = e.clientY;
    if (show)
        dragged.push(...polygons.slice(0, getPolygonCount()).filter((p) => Math.hypot(mouse.x - p.x, mouse.y - p.y) < p.radius));
});
const rave = {
    on: false,
    colors: [
        "#ff6d4c",
        "#ffc627",
        "#a8ff41",
        "#2ffff3",
        "#f954ff",
    ],
};
window.addEventListener("mouseup", () => {
    if (dragged.length === getPolygonCount()) {
        dragged.forEach((polygon) => polygon.heading = Math.random() * 2 * Math.PI);
        rave.on = true;
        setTimeout(() => rave.on = false, 5000);
    }
    else
        for (const polygon of dragged)
            polygon.heading = Math.atan2(mouse.y - mouse.dy, mouse.x - mouse.dx);
    mouse.dx = -1;
    mouse.dy = -1;
    dragged.length = 0;
});
const titles = [
    "kelsny",
    "_elsny",
    "k_lsny",
    "ke_sny",
    "kel_ny",
    "kels_y",
    "kelsn_",
];
let i = 0;
setInterval(() => (document.title = titles[(i = i >= titles.length - 1 ? 0 : i + 1)]), 1000);
const card = document.querySelector(".card");
const info = document.querySelector(".info");
setTimeout(() => {
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
    info.style.pointerEvents = "none";
});
// let delta = 0;
// document.addEventListener("wheel", (e) => {
//         const lastDelta = delta;
//         delta = Math.max(0, Math.min(500, delta + e.deltaY));
//         if (delta === 500 && lastDelta !== delta) {
//                 card.style.opacity = "0";
//                 card.style.transform = "scale(0.9)";
//                 card.style.pointerEvents = "none";
//                 info.style.opacity = "1";
//                 info.style.transform = "";
//                 info.style.pointerEvents = "";
//         }
//         if (delta === 0 && lastDelta !== delta) {
//                 card.style.opacity = "1";
//                 card.style.transform = "";
//                 card.style.pointerEvents = "";
//                 info.style.opacity = "0";
//                 info.style.transform = "";
//                 info.style.pointerEvents = "none";
//         }
// });
