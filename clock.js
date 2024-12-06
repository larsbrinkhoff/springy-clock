var canvas;
var context;
var size;

var hands = [
    { radius: .95, width: .01, tension: 1.5, dampening: 0.8 },
    { radius: .98, width: .03, tension: 0.5, dampening: 0.98 },
    { radius: .65, width: .08, tension: 0.2, dampening: 0.998 }
];

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

function update() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    size = Math.min(canvas.width, canvas.height) / 2;

    drawWindow();
    for (i = 0; i < hands.length; i++) {
        updateHand(hands[i]);
        drawHand(hands[i]);
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
