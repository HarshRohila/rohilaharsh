import { Component, h, getAssetPath, Env } from '@stencil/core';
import { makeServer } from '../../mirage';

makeServer({ environment: 'development' });
@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  assetsDirs: ['assets'],
  shadow: true,
})
export class AppRoot {
  getUrl(url: string) {
    let prefix = '';

    if (Env.apiEnv === 'prod') {
      prefix = 'gmail-clone';
    }

    return prefix + url;
  }

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
                <stencil-route url={this.getUrl('/')} component="app-home" exact />
                <stencil-route url={this.getUrl('/profile/:name')} component="app-profile" />
              </stencil-route-switch>
            </stencil-router>
          </main>
        </div>
      </div>
    );
  }
}
