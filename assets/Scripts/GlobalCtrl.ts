import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlobalCtrl')
export class GlobalCtrl extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    say() {
        console.log('global ctrl say');
    }
}


