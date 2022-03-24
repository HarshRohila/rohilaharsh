import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'check-box',
  shadow: true,
})
export class CheckBox {
  @Prop() value = false;

  render() {
    return (
      <Host>{this.value ? <slot name="checked"></slot> : <slot name="unchecked"></slot>}</Host>
    );
  }
}
