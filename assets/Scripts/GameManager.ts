import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc'
import { PlayerController } from './PlayerController'
const { ccclass, property } = _decorator

// 地图中的空隙也是盒子，属于无颜色的 BT_NONE 类型
enum BlockType {
  BT_NONE,
  BT_WHITE
}

enum GameState {
  GS_MENU,
  GS_PLAYING
}

@ccclass('GameManager')
export class GameManager extends Component {
  @property(Prefab)
  public boxPerfab: Prefab = null

  @property
  public roadLength = 50

  @property(PlayerController)
  public playerCtrl: PlayerController = null

  @property(Node)
  public startMenu: Node = null

  @property(Label)
  public stepLabel: Label = null

  private _road: BlockType[] = []

  start() {
    this.setGameState(GameState.GS_MENU)
    // !! ctrl.node获取到脚本附加的节点
    this.playerCtrl.node.on('jumpEnd', this.onJumpEnd, this)
  }

  onJumpEnd(val: number) {
    this.stepLabel.string = val + ''

    if (val >= this.roadLength) {
      console.log('游戏通关')
      this.setGameState(GameState.GS_MENU)
    } else if (this._road[val] === BlockType.BT_NONE) {
      console.log('游戏失败')
      this.setGameState(GameState.GS_MENU)
    }
  }

  // StartBtn绑定的点击事件
  onStartBtnMouseDown() {
    this.setGameState(GameState.GS_PLAYING)
  }

  setGameState(val: GameState) {
    if (val === GameState.GS_MENU) {
      // 之前视野发生了变化，需进行重置
      this.playerCtrl.reset()
      this.stepLabel.string = val + ''
      // 重新生成地图
      this.generateRoad()
      this.playerCtrl.setCanControl(false)
      this.startMenu.active = true
    } else {
      this.playerCtrl.setCanControl(true)
      this.startMenu.active = false
    }
  }

  generateRoad() {
    // reset
    this._road = []
    this.node.removeAllChildren()

    console.log('_road_1', this._road)

    // 默认有一个实体格子
    this._road.push(BlockType.BT_WHITE)

    // 构建空格子在内的格子队列
    for (let i = 1; i < this.roadLength; i++) {
      if (this._road[i - 1] === BlockType.BT_NONE) {
        this._road.push(BlockType.BT_WHITE)
      } else {
        this._road.push(
          Math.random() < 0.5 ? BlockType.BT_NONE : BlockType.BT_WHITE
        )
      }
    }

    // 遍历格子队列，生成实体格子
    for (let i = 1; i < this.roadLength; i++) {
      if (this._road[i] === BlockType.BT_WHITE) {
        const box = instantiate(this.boxPerfab)
        // box.setParent(this.node)
        this.node.addChild(box)
        box.setPosition(i * 40, 0, 0)
      }
    }

    console.log('_road_2', this._road)
  }
}
