import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'star-checkbox',
  styleUrl: 'star-checkbox.scss',
  shadow: true,
})
export class StarCheckbox {
  @Prop() value = false;

  @Event() toggled: EventEmitter<boolean>;

  toggleValue() {
    this.toggled.emit(!this.value);
  }

  render() {
    return (
      <Host>
        <check-box value={this.value}>
          <x-icon
            class="hollow"
            onClick={() => this.toggleValue()}
            slot="unchecked"
            icon={faStar}
          ></x-icon>
          <x-icon
            onClick={() => this.toggleValue()}
            class="solid"
            slot="checked"
            icon={solidStar}
          ></x-icon>
        </check-box>
      </Host>
    );
  }
}
