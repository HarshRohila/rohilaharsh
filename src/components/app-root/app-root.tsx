import { Component, h, getAssetPath } from '@stencil/core';
import { makeServer } from '../../mirage';

makeServer({ environment: 'development' });
@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  assetsDirs: ['assets'],
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div
        class="root"
        style={{ backgroundImage: `url(${getAssetPath('./assets/background.jpg')})` }}
      >
        <app-header></app-header>
        <div class="content">
          <side-bar></side-bar>
          <main>
            <stencil-router>
              <stencil-route-switch scrollTopOffset={0}>
                <stencil-route url="/" component="app-home" exact />
                <stencil-route url="/profile/:name" component="app-profile" />
              </stencil-route-switch>
            </stencil-router>
          </main>
        </div>
      </div>
    );
  }
}
