interface Vector2 {
    x: number,
    y: number,
}

interface MovementInput {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
}

class GameObject implements Vector2 {
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

    applyVelocity(): void {
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
}

class Player extends GameObject {
    dir: Vector2;
    movInput: MovementInput;

    constructor(
        x: number, y: number,
        w: number, h: number,
        speed: number,
        imagePath: string,
    ) {
        super(x, y, w, h, speed, imagePath);
        this.dir = { x: 0, y: 0 };
        this.movInput = {
            left: false,
            right: false,
            up: false,
            down: false,
        };
    }

    startInput(): void {
        document.addEventListener("keydown", (event) => {
            if (event.key == "ArrowLeft") this.movInput.left = true;
            if (event.key == "ArrowRight") this.movInput.right = true;
            if (event.key == "ArrowUp") this.movInput.up = true;
            if (event.key == "ArrowDown") this.movInput.down = true;
        });
        document.addEventListener("keyup", (event) => {
            if (event.key == "ArrowLeft") this.movInput.left = false;
            if (event.key == "ArrowRight") this.movInput.right = false;
            if (event.key == "ArrowUp") this.movInput.up = false;
            if (event.key == "ArrowDown") this.movInput.down = false;
        });
    }
}

function getCanvas() {
    let canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    return { canvas, context };
}

function createGameObjects() {
    let player = new Player(
        0, // x
        0, // y
        32, // w
        32, // h
        3, // speed,
        "../assets/art/player.png", // imagePath (I typed the path of this without looking at the folders first try!!!!)
    );
    return { player };
}

let { canvas, context } = getCanvas();
if (!context) {
    console.error("Canvas context missing");
} else {
    let backgroundImage = new Image();
    backgroundImage.src = "../assets/art/Background.png";

    let { player } = createGameObjects();
    player.x = (canvas.width / 2) - (player.w / 2);
    player.y = canvas.height - (player.h * 2);
    player.startInput();

    let update = () => {
        player.dir.x = -(player.movInput.left ? 1 : 0) + (player.movInput.right ? 1 : 0);
        player.dir.y = -(player.movInput.up ? 1 : 0) + (player.movInput.down ? 1 : 0);
        player.vel.x = player.dir.x * player.speed;
        player.vel.y = player.dir.y * player.speed;
        player.applyVelocity();
    };
    setInterval(update, 17);

    let draw = () => {
        context.drawImage(backgroundImage, 0, 0);
        context.drawImage(player.image, player.x, player.y);

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}
