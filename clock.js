var canvas;
var context;
var milliseconds = 5;

var hands = [
    { radius: .90, width: .01, tension: 1.5, dampening: 0.8 },
    { radius: .80, width: .03, tension: 0.5, dampening: 0.98 },
    { radius: .60, width: .08, tension: 0.2, dampening: 0.998 }
];

function modulo2PI(x) {
    return (x + Math.PI) % (2*Math.PI) - Math.PI;
}

function drawHand(hand) {
    context.strokeStyle = "black";
    context.lineWidth = hand.width;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(canvas.width/2, canvas.height/2);
    context.lineTo(canvas.width/2 + hand.radius * Math.cos(hand.angle),
                   canvas.height/2 - hand.radius * Math.sin(hand.angle));
    context.stroke();
}

function drawWindow(x) {
    context.fillStyle = "rgba(255,255,255,0.3)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    let size = .9 * Math.min(canvas.width, canvas.height) / 2;
    context.font = "50px Arial";
    context.fillStyle = "rgba(0,0,0,1.0)";
    context.fillText("halv tolv", 20, 100);
    context.fillText("11:30", 20, 150);
    for (i = 1; i <= 12; i++) {
	let a = 3.14159 * ((i-3)/6)
	context.fillText("" + i,
                         canvas.width/2 + size * Math.cos(a),
                         canvas.height/2 + size * Math.sin(a) + 15);
    }
}

function updateHand(hand) {
    let force = modulo2PI(hand.target - hand.angle);
    hand.velocity += hand.tension * force * milliseconds/30;
    //hand.velocity *= Math.pow(hand.dampening, milliseconds/30);
    hand.velocity *= Math.pow(hand.dampening, milliseconds/30);
    //hand.angle += milliseconds*0.7/30 * hand.velocity;
    hand.angle += milliseconds*0.7/30 * hand.velocity;
}

function update() {
    drawWindow();
    for (i = 1; i < hands.length; i++) {
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
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    if (canvas.getContext)
        context = canvas.getContext("2d");

    let size = Math.min(canvas.width, canvas.height) / 2;
    for (i = 0; i < hands.length; i++) {
        hands[i].radius *= size;
        hands[i].width *= size;
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

    setInterval(update, milliseconds);
    setInterval(tick, 1000);
}
