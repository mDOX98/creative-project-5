
const Time = require('./Settings');
const THRESHHOLD = 100.0;

class Player {
    constructor(args) {
        this.name = args.name;
        this.hp = args.hp;
        this.attackBonus = args.attackBonus;
        this.dmgBonus = args.dmgBonus;
        this.dmgRange = args.dmgRange;
        this.dodge = args.dodge;
        this.defense = args.defense;
        this.speed = args.speed;
        this.ready = 0.0;
        this.isAttacking = false;
        this.canAttack = false;
        this.target = undefined;
        this.updated = true;
        //console.log(this);
        return this;
    }

    takeDamge(dmg) {
        let dmgAdjusted = (dmg - this.defense);
        if (dmgAdjusted > 0) {
            this.hp -= dmgAdjusted;
            console.log(`${this.name} took ${dmgAdjusted} damage! (hp=${this.hp})`);
            this.updated = true;
        }
    }

    Update(timeStep) {

        if (this.ready < THRESHHOLD) {
            this.ready += 40 * Math.pow(1.1, this.speed) * timeStep / 1000;
            //console.log(`time = ${this.ready}`);
            if (this.ready > THRESHHOLD) {

                this.ready = THRESHHOLD;
            }
            this.updated = true;
        }
        else {
            this.updated = false;
        }


    }

    PlayerIsDead() {
        return (this.hp <= 0);
    }
    CanAttack() {
        return (this.ready >= THRESHHOLD && !this.PlayerIsDead());
    }

    Attack() {
        this.ready = 0.0
        this.isAttacking = false;
        let output = { attackRoll: Math.ceil(Math.random() * 20), dmgRoll: Math.ceil(Math.random() * this.dmgRange) + this.dmgBonus };
        console.log(output);
        return output;
    }

    ReceiveAttack(rolls) {
        if (rolls.attackRoll > this.dodge) {
            this.takeDamge(rolls.dmgRoll);

        }
    }



}

module.exports = Player;