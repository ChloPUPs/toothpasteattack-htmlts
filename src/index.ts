/* Toothpaste Attack! (htmlts edition) */
// Maybe add hitbox padding?

interface Vector2 {
    x: number;
    y: number;
}

interface MovementInput {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

interface ToothpasteList {
    arr: GameObject[];
    count: number;
    baseSpeed: number;
    toothpasteImagePath: string;
}

function getRandomToothpasteX() {
    return Math.random() * canvas.width;
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

    applyVelocity(timePassed: number): void {
        if (this.vel.x != 0) {
            this.x += (timePassed / 10) * this.vel.x;
        }
        if (this.vel.y != 0) {
            this.y += (timePassed / 10) * this.vel.y;
        }
    }
}

class Player extends GameObject {
    dir: Vector2;
    movInput: MovementInput;

    constructor (
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
        2.2, // speed,
        "../assets/art/player.png", // imagePath (I typed the path of this without looking at the folders first try!!!!)
    );
    return { player };
}

let startButton = document.getElementById("start-button") as HTMLButtonElement;

let music = document.getElementById("music") as HTMLAudioElement;

let backgroundImage = new Image();
backgroundImage.src = "../assets/art/Background.png";

let { canvas, context } = getCanvas();

function startGame() {
    if (!context) {
        console.error("Canvas context missing");
        return;
    }

    let lastTimestamp: number;

    let { player } = createGameObjects();
    let toothpastes: ToothpasteList = {
        arr: [],
        count: 10,
        baseSpeed: 2,
        toothpasteImagePath: "../assets/art/toothpaste.png",
    };
    for (let i = 0; i < toothpastes.count; i++) {
        let newToothpaste = new GameObject(
            getRandomToothpasteX(), // x
            -32, // y
            16, // w
            32, // h
            toothpastes.baseSpeed + (i/2), // speed
            toothpastes.toothpasteImagePath, // imagePath (also first try)
        );
        newToothpaste.vel.y = newToothpaste.speed;
        toothpastes.arr.push(newToothpaste);
    }

    music.play().catch((reason) => console.error("Failed to play music:", reason));

    player.x = (canvas.width / 2) - (player.w / 2);
    player.y = canvas.height - (player.h * 2);
    player.startInput();

    let anim = (timestamp: number) => {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
            requestAnimationFrame(anim);
            return;
        }

        let timePassed = timestamp - lastTimestamp;

        toothpastes.arr.forEach((t) => t.applyVelocity(timePassed));
        toothpastes.arr.forEach((t) => {
            if (t.y > canvas.height) {
                t.y = -t.h;
                t.x = getRandomToothpasteX();
            }
        });

        player.dir.x = -(player.movInput.left ? 1 : 0) + (player.movInput.right ? 1 : 0);
        player.dir.y = -(player.movInput.up ? 1 : 0) + (player.movInput.down ? 1 : 0);
        player.vel.x = player.dir.x * player.speed;
        player.vel.y = player.dir.y * player.speed;
        player.applyVelocity(timePassed);

        // Begin Drawing

        context.drawImage(backgroundImage, 0, 0);

        toothpastes.arr.forEach(
            (t) => context.drawImage(t.image, Math.floor(t.x), Math.floor(t.y))
        );
        context.drawImage(player.image, Math.floor(player.x), Math.floor(player.y));

        // End Drawing

        lastTimestamp = timestamp;

        requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
}

startButton.addEventListener("click", () => {
    document.body.removeChild(startButton);
    startGame();
});
