let ctx;
let width;
let height;

document.addEventListener("DOMContentLoaded", main);
function main() {
    const canvas = document.querySelector("canvas");
    width = canvas.width;
    height = canvas.height;

    ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, width, height);
}