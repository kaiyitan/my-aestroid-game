"use strict";
let Asteroid = [];
let BulletBag = [];
let bullets = [];
let score = 0;
function MoveX(a) {
    return Number(a.attr("CorX")) + Number(a.attr("Speed")) * Math.cos(Number(a.attr("RotRad")) - 90 * Math.PI / 180);
}
function MoveY(a) {
    return Number(a.attr("CorY")) + Number(a.attr("Speed")) * Math.sin(Number(a.attr("RotRad")) - 90 * Math.PI / 180);
}
const radToDeg = (rad) => rad * 180 / Math.PI;
function randNum(min, max) {
    return Math.random() * (max - min) + min;
}
function dis(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
function ships() {
    const svg = document.getElementById("canvas");
    const maxSpeed = 100;
    const minSpeed = 5;
    const turn_R = 0.2;
    const thrust = 1;
    const startShipCorX = 300;
    const startShipCorY = 300;
    const startShipRotRad = 0;
    function clashAsteroid(a) {
        let x1 = Number(a.attr("CorX"));
        let y1 = Number(a.attr("CorY"));
        let x2 = Number(g.attr("CorX"));
        let y2 = Number(g.attr("CorY"));
        let disAsteroid = Number(a.attr("r")) + 10;
        return dis(x1, y1, x2, y2) < disAsteroid;
    }
    function EatBulletBag(a) {
        let x1 = Number(a.attr("CorX"));
        let y1 = Number(a.attr("CorY"));
        let x2 = Number(g.attr("CorX"));
        let y2 = Number(g.attr("CorY"));
        let disBullet = Number(a.attr("height")) + 10;
        return dis(x1, y1, x2, y2) < disBullet;
    }
    let g = new Elem(svg, 'g')
        .attr("transform", `translate(${startShipCorX} ${startShipCorY}) rotate(${startShipRotRad})`)
        .attr('score', '0')
        .attr('life', '10')
        .attr('CorX', startShipCorX)
        .attr('CorY', startShipCorY)
        .attr('RotRad', startShipRotRad)
        .attr('Speed', minSpeed)
        .attr("bullet", '20')
        .attr("live", '1');
    let ship = new Elem(svg, 'polygon', g.elem)
        .attr("points", "-15,20 15,20 0,-20")
        .attr("style", "fill:lime;stroke:purple;stroke-width:1");
    const transformMatrix = (e) => new WebKitCSSMatrix(window.getComputedStyle(e.elem).webkitTransform);
    const Upkeydown = Observable.fromEvent(document, "keydown")
        .map((event) => ({ e: event.keyCode }))
        .filter(({ e }) => e == 38);
    const Upkeyup = Observable.fromEvent(document, "keyup")
        .map((event) => ({ e: event.keyCode }))
        .filter(({ e }) => e == 38);
    Observable.fromEvent(document, "keydown")
        .map((event) => ({ e: event.keyCode }))
        .filter(({ e }) => e == 32 && Number(g.attr("bullet")) > 0)
        .subscribe(() => {
        bullets.push(new Elem(svg, 'circle')
            .attr("transform", "ranslate(" + String(Number(g.attr("CorX"))) + " " + String(Number(g.attr("CorY"))) + ")" + "rotate(" + String(Number(g.attr("RotRad"))) + ")")
            .attr("r", 10)
            .attr("RotRad", Number(g.attr("RotRad")))
            .attr("fill", "white")
            .attr("Speed", 3)
            .attr("CorX", Number(g.attr("CorX")) + 2 * Math.cos(Number(g.attr("RotRad")) - 90 * Math.PI / 180))
            .attr("CorY", Number(g.attr("CorY")) + 2 * Math.sin(Number(g.attr("RotRad")) - 90 * Math.PI / 180)));
        g.attr("bullet", Number(g.attr("bullet")) - 1);
    });
    Observable.interval(10).subscribe(() => bullets.forEach(a => {
        let CorX = MoveX(a);
        let CorY = MoveY(a);
        a.attr("CorX", CorX);
        a.attr("CorY", CorY);
        a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
            "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
    }));
    Observable.interval(10).subscribe(() => bullets
        .filter(a => Number(a.attr("CorX")) < 0 || Number(a.attr("CorX")) > 600 || Number(a.attr("CorY")) < 0 || Number(a.attr("CorY")) > 600)
        .forEach(a => {
        a.elem.remove();
        bullets.splice(bullets.indexOf(a), 1);
    }));
    Observable.fromEvent(document, "keydown")
        .map((event) => ({ e: event.keyCode }))
        .filter(({ e }) => e == 37)
        .subscribe(() => {
        g.attr("RotRad", Number(g.attr("RotRad")) - turn_R);
        g.attr("transform", "translate(" + Number(g.attr("CorX")) + " " + Number(g.attr("CorY")) + ")" +
            "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.fromEvent(document, "keydown")
        .map((event) => ({ e: event.keyCode }))
        .filter(({ e }) => e == 39)
        .subscribe(() => {
        g.attr("RotRad", Number(g.attr("RotRad")) + turn_R);
        g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
            "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Upkeydown
        .subscribe(() => {
        g.attr("CorX", Number(g.attr("CorX")) + Math.round(Number(g.attr("Speed")) * Math.cos(Number(g.attr("RotRad")) - 90 * Math.PI / 180))),
            g.attr("CorY", Number(g.attr("CorY")) + Math.round(Number(g.attr("Speed")) * Math.sin(Number(g.attr("RotRad")) - 90 * Math.PI / 180))),
            g.attr("Speed", Math.max(minSpeed, Number(g.attr("Speed")))),
            g.attr("Speed", Math.min(Number(g.attr("Speed")) + thrust, maxSpeed));
        g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
            "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Upkeyup
        .flatMap(() => Observable
        .interval(10)
        .takeUntil(Upkeydown))
        .subscribe(() => {
        g.attr("CorX", Number(g.attr("CorX")) + Math.round(Number(g.attr("Speed")) * Math.cos(Number(g.attr("RotRad")) - 90 * Math.PI / 180))),
            g.attr("CorY", Number(g.attr("CorY")) + Math.round(Number(g.attr("Speed")) * Math.sin(Number(g.attr("RotRad")) - 90 * Math.PI / 180))),
            g.attr("Speed", Math.max(Number(g.attr("Speed")) - Number(g.attr("Speed")) / minSpeed * thrust, 0));
        g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
            "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.fromEvent(document, "keydown")
        .map((event) => ({ e: event.keyCode }))
        .filter(({ e }) => e == 39)
        .subscribe(() => {
        g.attr("RotRad", Number(g.attr("RotRad")) + turn_R);
        g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
            "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.interval(10)
        .filter(() => Number(g.attr("CorX")) > 600).subscribe(() => {
        g.attr("CorX", '0'),
            g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.interval(10)
        .filter(() => Number(g.attr("CorX")) < 0).subscribe(() => {
        g.attr("CorX", '600'),
            g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.interval(10)
        .filter(() => Number(g.attr("CorY")) > 600).subscribe(() => {
        g.attr("CorY", '0'),
            g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.interval(10)
        .filter(() => Number(g.attr("CorY")) < 0).subscribe(() => {
        g.attr("CorY", '600'),
            g.attr("transform", "translate(" + g.attr("CorX") + " " + g.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(g.attr("RotRad"))) + ")");
    });
    Observable.interval(10).subscribe(() => Asteroid
        .filter(a => clashAsteroid(a) && Number(g.attr("live")) == 1)
        .forEach(a => {
        a.elem.remove();
        Asteroid.splice(Asteroid.indexOf(a), 1);
        g.attr("life", String(Number(g.attr("life")) - Number(a.attr("damage"))));
        g.attr('CorX', startShipCorX);
        g.attr('CorY', startShipCorY);
        g.attr('RotRad', startShipRotRad);
        g.attr('Speed', minSpeed);
    }));
    Observable.interval(10).subscribe(() => BulletBag
        .filter(a => EatBulletBag(a))
        .forEach(a => {
        a.elem.remove();
        BulletBag.splice(BulletBag.indexOf(a), 1);
        g.attr("bullet", String(Number(g.attr("bullet")) + 20));
    }));
    Observable.interval(10).filter(() => Number(g.attr("life")) > 0).filter(() => Number(g.attr("score")) < 10).subscribe(() => g.attr("score", score));
    Observable.interval(10).subscribe(() => document.getElementById("life").textContent = "Life: " + String(g.attr('life')));
    Observable.interval(10).subscribe(() => document.getElementById("score").textContent = "Score: " + String(g.attr('score')));
    Observable.interval(10).subscribe(() => document.getElementById("bullet").textContent = "Bullet: " + String(g.attr('bullet')));
    Observable.interval(10).filter(() => Number(g.attr("life")) <= 0).subscribe(() => {
        g.attr('live', '0');
        g.elem.remove();
        svg.removeAttribute("g");
        document.getElementById("lose").textContent = "Game Over, you lose!";
    });
    Observable.interval(10).filter(() => Number(g.attr("score")) >= 10).subscribe(() => {
        g.attr('live', '0');
        g.elem.remove();
        svg.removeAttribute("g");
        document.getElementById("win").textContent = "Congratulation, you win!";
    });
}
function asteroids() {
    const svg = document.getElementById("canvas");
    Observable.interval(5000).subscribe(() => Asteroid.push(newAsteroid()));
    function splitAsteroid(x, y) {
        const a = new Elem(svg, 'circle');
        let startX = x;
        let startY = y;
        let startRotRada = randNum(0, Math.PI);
        a.attr("transform", `translate(${startX} ${startY}) rotate(${startRotRada})`);
        a.attr("r", 30);
        a.attr("RotRad", startRotRada);
        a.attr("fill", "#" + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1, 6));
        a.attr("damage", Number(a.attr("r")) / 30);
        a.attr("Speed", 60 / Number(a.attr("r")));
        a.attr("CorX", startX);
        a.attr("CorY", startY);
        a.attr("shooted", '0');
        a.attr("split", '0');
        Observable.interval(10).subscribe(() => {
            let CorX = MoveX(a);
            let CorY = MoveY(a);
            a.attr("CorX", CorX);
            a.attr("CorY", CorY);
            a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10).subscribe(() => bullets
            .filter(b => clashbullets(a, b) && Number(a.attr("shooted")) == 0 && Number(a.attr("split")) == 0)
            .forEach(b => {
            b.elem.remove();
            bullets.splice(bullets.indexOf(b), 1);
            a.attr("shooted", '1');
            a.elem.remove();
            Asteroid.splice(Asteroid.indexOf(a), 1);
            score += 1;
        }));
        Observable.interval(10)
            .filter(() => Number(a.attr("CorX")) > 600).subscribe(() => {
            a.attr("CorX", '0'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorX")) < 0).subscribe(() => {
            a.attr("CorX", '600'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorY")) > 600).subscribe(() => {
            a.attr("CorY", '0'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorY")) < 0).subscribe(() => {
            a.attr("CorY", '600'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        const a2 = new Elem(svg, 'circle');
        let startRotRadb = randNum(0, Math.PI);
        a2.attr("transform", `translate(${startX} ${startY}) rotate(${startRotRadb})`);
        a2.attr("r", 30);
        a2.attr("RotRad", startRotRadb);
        a2.attr("fill", "#" + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1, 6));
        a2.attr("damage", Number(a2.attr("r")) / 30);
        a2.attr("Speed", 60 / Number(a2.attr("r")));
        a2.attr("CorX", startX);
        a2.attr("CorY", startY);
        a2.attr("shooted", '0');
        a2.attr("split", '0');
        Observable.interval(10).subscribe(() => bullets
            .filter(b => clashbullets(a2, b) && Number(a2.attr("shooted")) == 0 && Number(a2.attr("split")) == 0)
            .forEach(b => {
            b.elem.remove();
            bullets.splice(bullets.indexOf(b), 1);
            a2.attr("shooted", '1');
            a2.elem.remove();
            Asteroid.splice(Asteroid.indexOf(a2), 1);
            score += 1;
        }));
        Observable.interval(10).subscribe(() => {
            let CorX = MoveX(a2);
            let CorY = MoveY(a2);
            a2.attr("CorX", CorX);
            a2.attr("CorY", CorY);
            a2.attr("transform", "translate(" + a2.attr("CorX") + " " + a2.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(a2.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a2.attr("CorX")) > 600).subscribe(() => {
            a2.attr("CorX", '0'),
                a2.attr("transform", "translate(" + a2.attr("CorX") + " " + a2.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a2.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a2.attr("CorX")) < 0).subscribe(() => {
            a2.attr("CorX", '600'),
                a2.attr("transform", "translate(" + a2.attr("CorX") + " " + a2.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a2.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a2.attr("CorY")) > 600).subscribe(() => {
            a2.attr("CorY", '0'),
                a2.attr("transform", "translate(" + a2.attr("CorX") + " " + a2.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a2.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a2.attr("CorY")) < 0).subscribe(() => {
            a2.attr("CorY", '600'),
                a2.attr("transform", "translate(" + a2.attr("CorX") + " " + a2.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a2.attr("RotRad"))) + ")");
        });
        return [a, a2];
    }
    function clashbullets(a, b) {
        let x1 = Number(a.attr("CorX"));
        let y1 = Number(a.attr("CorY"));
        let x2 = Number(b.attr("CorX"));
        let y2 = Number(b.attr("CorY"));
        let disAsteroid = Number(b.attr("r")) + Number(a.attr("r"));
        return dis(x1, y1, x2, y2) < disAsteroid;
    }
    function newAsteroid() {
        const a = new Elem(svg, 'circle');
        let startX = 0 * Math.round(randNum(0, 1));
        let startY = 600 * Math.round(randNum(0, 1));
        let startRotRad = randNum(0, Math.PI);
        let radius = 30 + 30 * Math.round(randNum(0, 0.7));
        a.attr("transform", `translate(${startX} ${startY}) rotate(${startRotRad})`);
        a.attr("r", radius);
        a.attr("RotRad", startRotRad);
        a.attr("fill", "#" + (0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1, 6));
        a.attr("damage", Number(a.attr("r")) / 30);
        a.attr("Speed", 60 / Number(a.attr("r")));
        a.attr("CorX", startX);
        a.attr("CorY", startY);
        a.attr("shooted", '0');
        a.attr("split", radius / 30 - 1);
        Observable.interval(10).subscribe(() => bullets
            .filter(b => clashbullets(a, b) && Number(a.attr("shooted")) == 0 && Number(a.attr("split")) == 0)
            .forEach(b => {
            b.elem.remove();
            bullets.splice(bullets.indexOf(b), 1);
            a.attr("shooted", '1');
            a.elem.remove();
            Asteroid.splice(Asteroid.indexOf(a), 1);
            score += 1;
        }));
        Observable.interval(10).subscribe(() => bullets
            .filter(b => clashbullets(a, b) && Number(a.attr("shooted")) == 0 && Number(a.attr("split")) == 1)
            .forEach(b => {
            b.elem.remove();
            bullets.splice(bullets.indexOf(b), 1);
            a.attr("shooted", '1');
            a.elem.remove();
            Asteroid.splice(Asteroid.indexOf(a), 1);
            Asteroid = Asteroid.concat(splitAsteroid(Number(a.attr("CorX")), Number(a.attr("CorY"))));
        }));
        Observable.interval(10).subscribe(() => {
            let CorX = MoveX(a);
            let CorY = MoveY(a);
            a.attr("CorX", CorX);
            a.attr("CorY", CorY);
            a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorX")) > 600).subscribe(() => {
            a.attr("CorX", '0'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorX")) < 0).subscribe(() => {
            a.attr("CorX", '600'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorY")) > 600).subscribe(() => {
            a.attr("CorY", '0'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        Observable.interval(10)
            .filter(() => Number(a.attr("CorY")) < 0).subscribe(() => {
            a.attr("CorY", '600'),
                a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
                    "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
        });
        return a;
    }
}
function bulletBags() {
    const svg = document.getElementById("canvas");
    Observable.interval(10000).subscribe(() => BulletBag.push(new Elem(svg, 'rect')
        .attr("transform", "translate(" + String(Math.floor(randNum(0, 600))) + " " + String(Math.floor(randNum(0, 600)))
        + "rotate(" + String(randNum(0, Math.PI)) + ")")
        .attr("RotRad", randNum(0, Math.PI))
        .attr("width", 60)
        .attr("height", 30)
        .attr("fill", "#FFFFFF")
        .attr("Speed", 1)
        .attr("CorX", Math.floor(randNum(0, 600)))
        .attr("CorY", Math.floor(randNum(0, 600)))));
    Observable.interval(10).subscribe(() => BulletBag.forEach(a => {
        let CorX = MoveX(a);
        let CorY = MoveY(a);
        a.attr("CorX", CorX);
        a.attr("CorY", CorY);
        a.attr("transform", "translate(" + a.attr("CorX") + " " + a.attr("CorY") + ")" +
            "rotate(" + radToDeg(Number(a.attr("RotRad"))) + ")");
    }));
    Observable.interval(10).subscribe(() => BulletBag
        .filter(a => Number(a.attr("CorX")) < 0 || Number(a.attr("CorX")) > 600 || Number(a.attr("CorY")) < 0 || Number(a.attr("CorY")) > 600)
        .forEach(a => {
        a.elem.remove();
        BulletBag.splice(BulletBag.indexOf(a), 1);
    }));
}
if (typeof window != 'undefined')
    window.onload = () => {
        ships();
        asteroids();
        bulletBags();
    };
//# sourceMappingURL=asteroids.js.map