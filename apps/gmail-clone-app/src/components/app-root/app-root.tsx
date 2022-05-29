/* eslint-disable react/jsx-no-bind */
import { Component, h, getAssetPath } from '@stencil/core'
import { createRouter, match, Route } from '@stencil/router'
import { makeServer } from '../../mirage'
import { OrbitJs } from '../../orbitjs'
import { AppRoute } from '../../utils/AppRoute'
makeServer({ environment: 'development' })

const Router = createRouter()

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  assetsDirs: ['assets'],
  shadow: true
})
export class AppRoot {
  async componentWillLoad() {
    await OrbitJs.activate()
  }

  render() {
    return (
      <div
        class="root"
        style={{
          backgroundImage: `url(${getAssetPath('./assets/background.jpg')})`
        }}
      >
        <app-header></app-header>
        <div class="content">
          <side-bar></side-bar>
          <main>
            <Router.Switch>
              <Route path={AppRoute.getPath('/')}>
                <app-home></app-home>
              </Route>
              <Route
                path={match(AppRoute.getPath('/profile/:name'))}
                render={({ name }) => <app-profile name={name}></app-profile>}
              />
              <Route
                path={match(AppRoute.getPath('/emails/:emailId'))}
                render={({ emailId }) => <gca-email-page emailId={emailId}></gca-email-page>}
              />
            </Router.Switch>
          </main>
        </div>
      </div>
    )
  }
}
