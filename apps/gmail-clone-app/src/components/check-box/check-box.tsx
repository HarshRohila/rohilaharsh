/* eslint-disable @stencil/required-jsdoc */
import { Component, Host, h, Prop } from '@stencil/core'

@Component({
  tag: 'check-box',
  shadow: true
})
export class CheckBox {
  @Prop() value = false

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}
