import { Component, Host, h } from '@stencil/core';
import { faBars, faCog, faBraille } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
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
          <x-icon icon={faBars}></x-icon>
          <img
            class="gb_sc"
            src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_r2.png"
            srcset="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_2x_r2.png 2x ,https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_r2.png 1x"
            alt=""
            aria-hidden="true"
          ></img>
          <h1>Stencil App Starter</h1>
          <x-icon icon={faQuestionCircle}></x-icon>
          <x-icon icon={faCog}></x-icon>
          <x-icon icon={faBraille}></x-icon>
        </header>
      </Host>
    );
  }
}
