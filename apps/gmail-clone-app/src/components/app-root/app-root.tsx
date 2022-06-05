/* eslint-disable react/jsx-no-bind */
import { Component, h, getAssetPath, State, Fragment } from '@stencil/core'
import { createRouter, match, Route } from '@stencil/router'
import { Email, EmailService } from '../../email/service'
import { makeServer } from '../../mirage'
import { OrbitJs } from '../../orbitjs'
import { AppRoute } from '../../utils/AppRoute'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

makeServer({ environment: 'development' })

const Router = createRouter()

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  assetsDirs: ['assets'],
  shadow: true
})
export class AppRoot {
  @State() isLoading = true
  @State() emails: Email[]

  async componentWillLoad() {
    await OrbitJs.activate()
    this.requestEmails()
  }

  private requestEmails() {
    EmailService.getEmails()
      .then(emails => {
        this.emails = emails
      })
      .finally(() => {
        this.isLoading = false
      })
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
        <div class={`content ${this.isLoading ? 'loading' : ''}`}>
          {this.isLoading && <x-icon class="spinner" icon={faSpinner} spin></x-icon>}
          {!this.isLoading && (
            <Fragment>
              <side-bar></side-bar>
              <main>
                <Router.Switch>
                  <Route path={AppRoute.getPath('/')}>
                    <app-home
                      emails={this.emails}
                      onWillLoadCalled={() => this.requestEmails()}
                    ></app-home>
                  </Route>
                  <Route
                    path={match(AppRoute.getPath('/emails/starred'))}
                    render={() => <gca-starred-emails></gca-starred-emails>}
                  />
                  <Route
                    path={match(AppRoute.getPath('/emails/:emailId'))}
                    render={({ emailId }) => <gca-email-page emailId={emailId}></gca-email-page>}
                  />
                </Router.Switch>
              </main>
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}
