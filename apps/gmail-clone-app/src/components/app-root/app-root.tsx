/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, getAssetPath } from '@stencil/core';
import { createRouter, match, Route } from '@stencil/router';
import { makeServer } from '../../mirage';
import { pageState } from '../../states/page';
import { AppRoute } from '../../utils/AppRoute';
makeServer({ environment: 'development' });

const Router = createRouter();

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
        style={{
          backgroundImage: `url(${getAssetPath('./assets/background.jpg')})`,
        }}
      >
        <app-header></app-header>
        <div class="content">
          <side-bar class={pageState.showSidebar ? 'show' : ''}></side-bar>
          <main>
            <Router.Switch>
              <Route path={AppRoute.getPath('/')}>
                <app-home></app-home>
              </Route>
              <Route
                path={match(AppRoute.getPath('/profile/:name'))}
                render={({ name }) => <app-profile name={name}></app-profile>}
              />
            </Router.Switch>
          </main>
        </div>
      </div>
    );
  }
}
