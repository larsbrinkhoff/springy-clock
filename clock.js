var canvas;
var context;
var size;

var hands = [
    { mass: 0.03, radius: .85, width: .01, tension: 1.5, dampening: 0.8 },
    { mass: 0.07, radius: .80, width: .03, tension: 0.5, dampening: 0.98 },
    { mass: 0.20, radius: .60, width: .08, tension: 0.2, dampening: 0.998 }
];

var numbers;

function modulo2PI(x) {
    return (x + Math.PI) % (2*Math.PI) - Math.PI;
}

function drawHand(hand) {
    context.strokeStyle = "black";
    context.lineWidth = size * hand.width;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(canvas.width/2, canvas.height/2);
    context.lineTo(canvas.width/2 + size * hand.radius * Math.cos(hand.angle),
                   canvas.height/2 - size * hand.radius * Math.sin(hand.angle));
    context.stroke();
}

function drawWindow(x) {
    context.fillStyle = "rgba(255,255,255,0.6)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function updateHand(hand) {
    let force = modulo2PI(hand.target - hand.angle);
    hand.velocity += hand.tension * force;
    hand.velocity *= hand.dampening;
    hand.angle += 0.7 * hand.velocity;
}

function updateNumber(number) {
    number.posx = number.centerx;
    number.posy = number.centery;

    hand = hands[0];
    handx = 0.5 * hand.radius * Math.cos(hand.angle);
    handy = 0.5 * hand.radius * Math.sin(hand.angle);
    deltax = handx - number.centerx;
    deltay = handy - number.centery;
    f = hand.mass / (deltax*deltax + deltay*deltay);
    number.posx = number.centerx + f * deltax;
    number.posy = number.centery + f * deltay;

    hand = hands[1];
    handx = 0.5 * hand.radius * Math.cos(hand.angle);
    handy = 0.5 * hand.radius * Math.sin(hand.angle);
    deltax = handx - number.centerx;
    deltay = handy - number.centery;
    f = hand.mass / (deltax*deltax + deltay*deltay);
    number.posx += f * deltax;
    number.posy += f * deltay;

    hand = hands[2];
    handx = 0.5 * hand.radius * Math.cos(hand.angle);
    handy = 0.5 * hand.radius * Math.sin(hand.angle);
    deltax = handx - number.centerx;
    deltay = handy - number.centery;
    f = hand.mass / (deltax*deltax + deltay*deltay);
    number.posx += f * deltax;
    number.posy += f * deltay;
}

function drawNumber(number) {
    context.fillStyle = "black";
    context.font = "" + Math.round(size/10) + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(number.text,
                     canvas.width/2 + 1.35 * size * number.posx,
                     canvas.height/2 - 1.35 * size * number.posy);
}

function update() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    size = Math.min(canvas.width, canvas.height) / 2;

    drawWindow();
    for (i = 0; i < hands.length; i++) {
        updateHand(hands[i]);
        drawHand(hands[i]);
    }
    for (i = 0; i < numbers.length; i++) {
        updateNumber(numbers[i]);
        drawNumber(numbers[i]);
    }
}

function tick() {
    let now = new Date();
    let second = now.getSeconds();
    hands[0].target = Math.PI/2 - 2*Math.PI * second / 60;
    hands[1].target = Math.PI/2 - 2*Math.PI * now.getMinutes() / 60;
    hands[1].target -= 2*Math.PI * Math.floor(second / 15) / 60 / 4;
    hands[2].target = Math.PI/2 - 2*Math.PI * now.getHours() / 12;
    hands[2].target -= 2*Math.PI * now.getMinutes() / 60 / 12;
}

window.onload = function() {
    document.body.style = "margin:0; padding:0;";
    canvas = document.getElementById("clock");
    canvas.style.filter = "blur(1px)";
    if (canvas.getContext)
        context = canvas.getContext("2d");

    for (i = 0; i < hands.length; i++) {
        hands[i].velocity = 0;
    }

    numbers = new Array(12);
    for (i = 0; i < numbers.length; i++) {
        numbers[i] = {};
        numbers[i].text = (i == 0 ? "12" : ""+i);
        angle = 2 * Math.PI * i / numbers.length;
        angle = 0.5 * Math.PI - angle;
        numbers[i].centerx = Math.cos(angle);
        numbers[i].centery = Math.sin(angle);
    }

    let now = new Date();
    hands[0].target = Math.PI/2 - 2*Math.PI * now.getSeconds() / 60;
    hands[1].target = Math.PI/2 - 2*Math.PI * now.getMinutes() / 60;
    hands[2].target = Math.PI/2 - 2*Math.PI * now.getHours() / 12;
    hands[2].target -= 2*Math.PI * now.getMinutes() / 60 / 12;
    hands[0].angle = hands[0].target;
    hands[1].angle = hands[1].target;
    hands[2].angle = hands[2].target;

    setInterval(update, 30);
    setInterval(tick, 1000);
}
