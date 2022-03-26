import { Component, h } from '@stencil/core';
import { pageState } from '../../states/page';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: true,
})
export class AppHome {
  render() {
    return (
      <div class="app-home">
        <email-list class={pageState.showSidebar ? 'sidebar' : ''}></email-list>

        {/* <stencil-route-link url="/profile/stencil">
          <button>Profile page</button>
        </stencil-route-link> */}
      </div>
    );
  }
}
