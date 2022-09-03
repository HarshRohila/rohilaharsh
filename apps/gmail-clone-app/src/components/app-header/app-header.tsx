/* eslint-disable react/jsx-no-bind */
import { Component, Host, h } from '@stencil/core'
import { faBars, faCog, faBraille, faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { SideBar } from '../../states/sideBar'
import { EmailSelection } from '../../states/emailSelection'
@Component({
  tag: 'app-header',
  styleUrl: 'app-header.scss',
  shadow: true
})
export class AppHeader {
  get isSelectionMode() {
    return !!EmailSelection.state.selectedEmailIds.size
  }

  render() {
    return (
      <Host>
        <header>
          {!this.isSelectionMode && (
            <div class="left">
              <div class="brand">
                <MenuToggler />
                <img
                  class="gb_sc"
                  src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_r2.png"
                  srcset="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_2x_r2.png 2x ,https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_r2.png 1x"
                  alt=""
                  aria-hidden="true"
                ></img>
              </div>

              <div class="search">
                <MenuToggler />
                <x-icon icon={faSearch}></x-icon>
                <input type="search" placeholder="Search mail" />
                <x-icon class="settings-icon" icon={faSlidersH}></x-icon>
              </div>
            </div>
          )}

          <div class="right">
            <x-icon icon={faQuestionCircle}></x-icon>
            <x-icon icon={faCog}></x-icon>
            <x-icon icon={faBraille}></x-icon>
          </div>
        </header>
      </Host>
    )
  }
}

function MenuToggler() {
  return (
    <x-icon
      class="menu-toggler"
      icon={faBars}
      onClick={() => {
        SideBar.toggle()
      }}
    ></x-icon>
  )
}
