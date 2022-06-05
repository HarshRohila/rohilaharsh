/* eslint-disable @stencil/required-jsdoc */
import { Component, Host, h, Element, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'gca-mobile-side-bar',
  styleUrl: 'gca-mobile-side-bar.scss',
  shadow: true
})
export class GcaMobileSideBar {
  @Element() el: HTMLGcaMobileSideBarElement

  @Event() clickedOutside: EventEmitter<void>

  connectedCallback() {
    this.handleWindowClick = this.handleWindowClick.bind(this)
    window.addEventListener('click', this.handleWindowClick)
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.handleWindowClick)
  }

  private handleWindowClick(e) {
    if (!this.el.contains(e.target)) {
      this.clickedOutside.emit()
    }
  }

  render() {
    return (
      <Host>
        <div class="modal">
          <side-bar></side-bar>
        </div>
      </Host>
    )
  }
}
