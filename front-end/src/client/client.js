

class Client {

    constructor() {
        this.me = undefined;
        this.opponent = undefined;
        this.parent = undefined;
        this.winner = undefined;
        this.disconnected = false;
        console.log("Starting Client...");
        this.ws = new WebSocket("ws://localhost:8080");

        this.ws.addEventListener("open", () => {
            this.msg_ATTACK();
        });

        this.ws.addEventListener("close", () => {
            console.log("Lost host connection!");

        });

        this.ws.addEventListener("message", (data) => {
            let packet = JSON.parse(data.data)
            // console.log(`message received from server: ${data.data}`)

            let msg = packet.msg;
            //console.log(`Server sent us: ${data.data}`);
            switch (msg) {
                case "_update":
                    //console.log("UPDATE PLAYER");
                    this.me = packet.players[0];
                    this.opponent = packet.players[1];
                    this.parent.PageCallback();
                    //console.log(`my ready % = ${this.me.ready}, their ready % = ${this.opponent.ready}`);
                    break;

                case "_winner":
                    this.winner = packet.winner;
                    this.me = undefined;
                    this.opponent = undefined;
                    this.parent.PageCallback();
                    break;

                case "_disconnected":
                    console.log("DISCONNECTED");
                    this.me = undefined;
                    this.opponent = undefined;
                    this.disconnected = true;
                    this.parent.PageCallback();
                    break;
                default:
                    console.log("Invalid Message")
                    break
            }



        });

    }

    msg_ATTACK() {
        this.ws.send(JSON.stringify({ msg: "_Attack" }));
    }

}

//


export default Client;