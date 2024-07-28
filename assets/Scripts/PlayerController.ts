import { _decorator, Animation, Component, EventMouse, Input, input } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PlayerController')
export class PlayerController extends Component {
  private _allJumpTime = 200 // 每次跳动的总时长（毫秒）
  private _allDistance = 0 // 每次跳动的总距离

  // need reset after jump
  private _startJump = false // 是否开始跳动
  private _accJumpTime = 0 // 每次跳动时的累积时间
  private _totalStep = 0

  // 等价于this.node.getChildByName('Body').getComponent(Animation)
  @property(Animation)
  public bodyAnim: Animation = null

  start() {}

  setCanControl(val: Boolean) {
    if (val) {
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
    } else {
      input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
    }
  }

  protected onDestroy(): void {
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
  }

  onMouseDown(event: EventMouse) {
    if (event.getButton() === EventMouse.BUTTON_LEFT) {
      this.jumpByStep(1)
    } else if (event.getButton() === EventMouse.BUTTON_RIGHT) {
      this.jumpByStep(2)
    }
  }

  jumpByStep(step: number) {
    // 跳动时锁定
    if (this._startJump) return

    // x轴的动画时间和y轴的保持一致
    const aniName = step === 1 ? 'jump' : 'jump2'
    const duration = this.bodyAnim.getState(aniName).duration
    this._allJumpTime = duration * 1000

    // 播放x轴动画，x轴动画挂载Player身上
    this._allDistance = 40 * step
    this._startJump = true

    // 播放y轴动画，y轴动画挂载Body身上
    this.bodyAnim.play(aniName)

    // 动画结束后更新跳动步数
    this._totalStep = this._totalStep + step
  }

  update(deltaTime: number) {
    // 让跳动变得平滑
    if (this._startJump) {
      deltaTime = deltaTime * 1000
      this._accJumpTime += deltaTime
      if (this._accJumpTime > this._allJumpTime) {
        // 补齐最后一帧的位移
        // const distance =
        //   ((this._allJumpTime - (this._allJumpTime - deltaTime)) /
        //     this._allJumpTime) *
        //   this._allDistance
        const distance = 40 - (this.node.position.x % 40)
        this.setPositionX(distance)
        // reset
        this._startJump = false
        this._accJumpTime = 0
        // emit end event
        this.node.emit('jumpEnd', this._totalStep)
      } else {
        const distance = (deltaTime / this._allJumpTime) * this._allDistance
        this.setPositionX(distance)
      }
    }
  }

  setPositionX(distance: number) {
    const curPosition = this.node.position
    this.node.setPosition(
      curPosition.x + distance,
      curPosition.y,
      curPosition.z
    )
  }

  reset() {
    this.node.setPosition(0, 0, 0)
    this._totalStep = 0
  }
}
