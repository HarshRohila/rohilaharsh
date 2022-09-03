import { faCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'

@Component({
  tag: 'icon-button',
  styleUrl: 'icon-button.scss',
  shadow: true
})
export class IconButton {
  @Event() clicked: EventEmitter<void>
  @Prop() icon: IconDefinition

  render() {
    return (
      <button class="icon" onClick={() => this.clicked.emit()}>
        <x-icon class="circle" icon={faCircle}></x-icon>
        <x-icon class="main-icon" icon={this.icon}></x-icon>
      </button>
    )
  }
}
