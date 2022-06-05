/* eslint-disable @stencil/required-jsdoc */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @stencil/ban-prefix */
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'star-checkbox',
  styleUrl: 'star-checkbox.scss',
  shadow: true
})
export class StarCheckbox {
  @Prop() value = false

  @Event() toggled: EventEmitter<boolean>

  private toggleValue() {
    this.toggled.emit(!this.value)
  }

  render() {
    return (
      <Host>
        <check-box value={this.value}>
          {this.value ? (
            <x-icon onClick={() => this.toggleValue()} class="solid" icon={solidStar}></x-icon>
          ) : (
            <x-icon class="hollow" onClick={() => this.toggleValue()} icon={faStar}></x-icon>
          )}
        </check-box>
      </Host>
    )
  }
}
