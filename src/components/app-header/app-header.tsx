import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-header',
  styleUrl: 'app-header.scss',
  shadow: true,
})
export class AppHeader {
  render() {
    return (
      <Host>
        <header>
          <h1>Stencil App Starter</h1>
        </header>
      </Host>
    );
  }
}
