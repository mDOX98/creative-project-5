
const Time = require('./Settings');

class GameManager {
    constructor(p1, p2, cb) {
        p1.target = 1;
        p2.target = 0;
        this.players = [p1, p2]
        this.gameInPlay = false;
        this.intervalTimer = undefined;

        this.currentTime = Date.now();
        this.lastTime = Date.now();
        this.deltaTime = 0.0;
        this.waitTimeStart = 0.0;

        this.ServerCallback = cb;
        console.log("GAME INITIALIZED");
    }


    Update(gameInstance) {

        if (gameInstance.gameInPlay) {
            gameInstance.currentTime = Date.now();
            gameInstance.deltaTime = gameInstance.currentTime - gameInstance.lastTime;
            gameInstance.lastTime = gameInstance.currentTime;
            //console.log(gameInstance.deltaTime);
            let willUpdate = false;
            for (const p of gameInstance.players) {
                p.Update(gameInstance.deltaTime);

                if (p.PlayerIsDead()) {
                    console.log(`${p.name} has died!`)
                    gameInstance.gameInPlay = false;
                    gameInstance.ServerCallback(gameInstance, "_gameDone");
                    return;
                }

                if (p.isAttacking && p.CanAttack()) {
                    gameInstance.players[p.target].ReceiveAttack(p.Attack());

                } else {
                    p.isAttacking = false;
                }
                if (p.updated) {
                    willUpdate = true;

                }

            }
            if (willUpdate) {
                gameInstance.ServerCallback(gameInstance, "_update");
            }

        } else {
            clearInterval(this.intervalTimer);
        }

    }

    Start() {
        this.gameInPlay = true;
        this.lastTime = Date.now();
        //this.waitTimeStart = this.lastTime;
        this.intervalTimer = setInterval(this.Update, Time.deltaTimeMillis, this);
    }

}
module.exports = GameManager;