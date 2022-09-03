/* eslint-disable react/jsx-no-bind */
import { Component, h, getAssetPath, State, Fragment, Listen } from '@stencil/core'
import { createRouter, match, Route } from '@stencil/router'
import { Email, EmailService } from '../../email/service'
import { makeServer } from '../../mirage'
import { OrbitJs } from '../../orbitjs'
import { AppRoute } from '../../utils/AppRoute'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { SideBar } from '../../states/sideBar'

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

  @Listen('delete')
  handleDeleteEmail(ev: CustomEvent<Email>) {
    const emailToDelete = ev.detail
    this.emails = this.emails.filter(e => e.id !== emailToDelete.id)

    EmailService.deleteEmail(emailToDelete)
  }

  handleDeleteClick(emailIds: Set<string>) {
    this.emails = this.emails.filter(e => !emailIds.has(e.id))
  }

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
        <app-header onDeleteClicked={ev => this.handleDeleteClick(ev.detail)}></app-header>
        {SideBar.state.isOpen && (
          <gca-mobile-side-bar
            onClickedOutside={() => {
              SideBar.toggle()
            }}
          ></gca-mobile-side-bar>
        )}
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
                    path={match(AppRoute.getPath('/about'))}
                    render={() => <app-features></app-features>}
                  />
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
