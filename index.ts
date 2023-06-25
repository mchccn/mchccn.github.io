const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class RegularPolygon {
    constructor(
        public x: number,
        public y: number,
        public n: number,
        public radius = 1,
        public angle = 0,
    ) {}
}

const polygons = Array.from(
    { length: 48 },
    () => new RegularPolygon(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.floor(Math.random() * 3 + 3),
        Math.random() * 75 + 50,
        Math.random() * 2 * Math.PI,
    ),
);

let show = localStorage.getItem("show") ?? true;

const toggle = document.querySelector(".toggle")!;

toggle.textContent = show ? "hide shapes" : "show shapes";
document.querySelector("h1")!.style["-webkit-text-fill-color" as never] = show ? "" : "transparent";

toggle.addEventListener("click", () => {
    show = !show;

    if (show) requestAnimationFrame(update);

    toggle.textContent = show ? "hide shapes" : "show shapes";

    document.querySelector("h1")!.style["-webkit-text-fill-color" as never] = show ? "" : "transparent";

    localStorage.setItem("show", show ? "true" : "");
});

const dragged: RegularPolygon[] = [];

function update() {
    ctx.fillStyle = "white";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!show) return;

    const polygonCount = Math.ceil(((window.innerWidth * window.innerHeight) / 100000) * 0.75);

    polygons.slice(0, polygonCount).forEach((polygon) => {
        const [start, ...vertices] = [...Array(polygon.n).keys()].map(
            (i) => [
                polygon.x + Math.cos(polygon.angle + ((2 * Math.PI) / polygon.n) * i) * polygon.radius,
                polygon.y + Math.sin(polygon.angle + ((2 * Math.PI) / polygon.n) * i) * polygon.radius,
            ] as const,
        );

        ctx.beginPath();
        ctx.moveTo(...start);
        for (const vertice of vertices) ctx.lineTo(...vertice);
        ctx.closePath();
        ctx.fill();

        polygon.angle += polygon.radius / 2500;
        polygon.y += polygon.radius / 20;

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

const mouse = { x: -1, y: -1, down: false, idle: setTimeout(() => (document.body.style.cursor = "none"), 10 * 1000) };

window.addEventListener("mousemove", (e) => {
    document.body.style.cursor = "";

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    clearInterval(mouse.idle);

    mouse.idle = setTimeout(() => (document.body.style.cursor = "none"), 10 * 1000);
});

window.addEventListener("mousedown", () => {
    if (show)
        dragged.push(
            ...polygons.filter(
                (p) => Math.hypot(mouse.x - p.x, mouse.y - p.y) < p.radius
            )
        );
});

window.addEventListener("mouseup", () => {
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

setInterval(
    () => (document.title = titles[(i = i >= titles.length - 1 ? 0 : i + 1)]),
    1000
);

const card = document.querySelector<HTMLDivElement>(".card")!;
const info = document.querySelector<HTMLDivElement>(".info")!;

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
