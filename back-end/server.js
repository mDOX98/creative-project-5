const WebSocket = require('ws');
const GameManager = require('./game/GameManager');
const Player = require('./game/Player');
const Time = require('./game/Settings');
const wss = new WebSocket.Server({ port: 8080 });
var clients = [];
var players = [];
var game = undefined;

intervalTimer = undefined;

function jsf(value) {
    return JSON.stringify(value);
}

function updateCallback(game, argument) {
    if (argument == "_update") {
        if (clients.length == 2) {
            clients[0].send(jsf({ msg: "_update", players: [game.players[0], game.players[1]] }))
            clients[1].send(jsf({ msg: "_update", players: [game.players[1], game.players[0]] }))
        }

    }

    if (argument == "_disconnected") {
        for (let c of clients) {
            c.send(jsf({ msg: "_disconnected" }))
        }
        game.gameInPlay = false;
        game = undefined;
        for (let c of clients) {
            c.close();
        }
        clients = [];
        players = [];
    }

    if (argument == "_gameDone") {
        if (game.players[0].PlayerIsDead()) {
            clients[0].send(jsf({ msg: "_winner", winner: "You Lost!" }))
            clients[1].send(jsf({ msg: "_winner", winner: "You Won!" }))
        } else if (game.players[1].PlayerIsDead()) {
            clients[0].send(jsf({ msg: "_winner", winner: "You Won!" }))
            clients[1].send(jsf({ msg: "_winner", winner: "You Lost!" }))
        }
        game.gameInPlay = false;
        game = undefined;
        for (let c of clients) {
            c.close();
        }
        clients = [];
        players = [];

    }

}

wss.on("connection", (client) => {

    if (clients.length === 2) {
        return;
    }

    clients.push(client);
    players.push(new Player({ name: `Player ${clients.length}`, hp: 10, attackBonus: 0, dmgBonus: 0, dmgRange: 6, dodge: 10, defense: 0, speed: 0 }));
    //console.log(players);
    console.log(`New Client Connected! (${clients.length})`);

    if (clients.length === 2 && (game === undefined || !game.gameInPlay)) {
        game = new GameManager(players[0], players[1], updateCallback);

        game.Start();
        console.log("===Game Start===")
        //window.requestAnimationFrame(game.Update(game))
        //intervalTimer = setInterval(game.Update, Time.deltaTimeMillis, game);
    }

    client.on("close", () => {
        if (game !== undefined) {
            updateCallback(game, "_disconnected");
        }
        const index = clients.indexOf(client);
        clients.splice(index, 1);
        players.splice(index, 1);
        console.log(`Client has disconnected! (${clients.length})`);
    });

    client.on("message", (data) => {
        const index = clients.indexOf(client);
        let packet = JSON.parse(data);
        let msg = packet.msg;
        console.log(`Client sent us: ${data}`);
        switch (msg) {
            case "_Attack":
                if (game != undefined) {
                    game.players[index].isAttacking = true;
                }
                break;

            default:
                console.log("Invalid Message")
                break
        }
        //let testObj = { hp: 10, armor: 2 };
        //client.send(jsf(testObj));
    })
});
