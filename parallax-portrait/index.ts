const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

const image = new Image();

image.src = "mega.png";

await new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    
    image.onerror = (e) => reject(e);
});

canvas.width = image.width;
canvas.height = image.height;

ctx.drawImage(image, 0, 0);

const container = document.querySelector<HTMLDivElement>(".container")!;

container.style.width = "512px";
container.style.height = "512px";

Array.from({ length: 100 }, (_, i) => {
    return {
        x: (i % 10) * (canvas.width / 10) - 1,
        y: (i / 10 | 0) * (canvas.height / 10) - 1,
        s: canvas.width / 10 + 2,
    };
}).forEach(({ x, y, s }, i) => {
    const buffer = document.createElement("canvas");

    buffer.width = s;
    buffer.height = s;

    buffer.getContext("2d")!.putImageData(ctx.getImageData(x, y, s, s), 0, 0);

    const square = new Image(s, s);
    
    square.src = buffer.toDataURL();

    square.draggable = false;

    square.classList.add("circle");

    const style = getComputedStyle(container);

    const scale = {
        x: parseFloat(style.width) / image.width,
        y: parseFloat(style.height) / image.height,
    };

    square.style.width = scale.x * s + "px";
    square.style.height = scale.y * s + "px";

    square.style.left = scale.x * x + "px";
    square.style.top = scale.y * y + "px";

    const zed = Math.floor(Math.random() * 1000);

    square.style.transform = `translateZ(${1000 - zed}px)`;

    container.append(square);
});

setTimeout(() => container.style.animationPlayState = "running");

export { };
