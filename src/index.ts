interface Vector2 {
    x: number,
    y: number,
}

abstract class GameObject implements Vector2 {
    x: number;
    y: number;
    vel: Vector2;
    readonly w: number;
    readonly h: number;
    readonly speed: number;
    readonly image: HTMLImageElement;

    constructor (
        x: number, y: number,
        w: number, h: number,
        speed: number,
        imagePath: string,
    ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.vel = { x: 0, y: 0 };

        let newImage = new Image();
        newImage.src = imagePath;
        this.image = newImage;
    }
}

class Player extends GameObject {
    startInput(): void {
        document.addEventListener("keydown", (event) => {
            // TODO: add player input here
        });
    }
}

function getCanvas() {
    let canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    return {canvas, context};
}

function createGameObjects() {
    let player = new Player(
        0, // x
        0, // y
        32, // w
        32, // h
        2, // speed,
        "../assets/art/player.png", // imagePath (I typed the path of this without looking at the folders first try!!!!)
    );
    return {player};
}

let {canvas, context} = getCanvas();
if (!context) {
    console.error("Canvas context missing");
} else {
    let backgroundImage = new Image();
    backgroundImage.src = "../assets/art/Background.png";

    let {player} = createGameObjects();
    player.x = (canvas.width / 2) - (player.w / 2);
    player.y = canvas.height - (player.h * 2);
    player.startInput();

    let update = () => {
        // TODO: make apply velocity method for Player and call it here in player.
    };
    setInterval(update, 17);

    let draw = () => {
        context.drawImage(backgroundImage, 0, 0);
        context.drawImage(player.image, player.x, player.y);

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}
