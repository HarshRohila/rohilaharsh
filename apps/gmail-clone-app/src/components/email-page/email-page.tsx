import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'gca-email-page',
  styleUrl: 'email-page.css',
  shadow: true,
})
export class EmailPage {
  @Prop() emailId: string;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
