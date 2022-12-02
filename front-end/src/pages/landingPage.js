import React from 'react'
import Client from '../client/client';

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'start',
            client: undefined
        }
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("ATTACKING!");
        this.state.client.msg_ATTACK();
    }

    componentDidMount() {
        let obj = this.state;
        obj.client = new Client();
        obj.client.parent = this;
        this.setState(obj);

    }

    PageCallback() {

        this.setState(this.state);
    }

    render() {

        //console.log(this.state.client);
        if (this.state.client === undefined) {
            return (
                <div>
                    <h1> Waiting for game to start...</h1>
                </div>);
        } else {
            if (this.state.client.disconnected) {
                return (
                    <div>
                        <h1> PLAYER DISCONNECTED...</h1>
                    </div>);
            }
            if (this.state.client.me === undefined && this.state.client.winner === undefined) {
                return (
                    <div>
                        <h1> Waiting for game to start...</h1>
                    </div>);
            } else if (this.state.client.me === undefined) {
                return (
                    <div>
                        <h1> {this.state.client.winner}  Refresh to play again!</h1>
                    </div>);
            }
            let ReadySection = <></>;
            if (this.state.client.me.ready < 100) {
                ReadySection = (<div>
                    <h2>{Math.round(this.state.client.me.ready)}%</h2>
                </div>);
            } else {
                ReadySection = (<form ref="form" onSubmit={this.handleSubmit}>
                    <button type="submit">Attack!</button>
                </form>);
            }


            return (
                <div>
                    <h1> ---YOU---</h1>
                    <h2>HP = {this.state.client.me.hp}</h2>

                    <h1> ---THEM---</h1>
                    <h2>HP = {this.state.client.opponent.hp}</h2>

                    {ReadySection}
                </div>);
        }

    }
}

export default LandingPage;