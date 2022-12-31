/* eslint-disable @stencil/required-jsdoc */
import {
  faInbox,
  faQuestionCircle,
  faStar,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { Component, Host, h, Element, State } from '@stencil/core'
import { href } from '@stencil/router'
import { Subscription } from 'rxjs'
import { ComposeEmail, State as ComponseEmailState } from '../../states/compose-email'
import { AppRoute, Router } from '../../utils/AppRoute'
import newId from '../../utils/newId'

@Component({
  tag: 'side-bar',
  styleUrl: 'side-bar.scss',
  shadow: true
})
export class SideBar {
  @Element() el: HTMLSideBarElement

  @State() isLoaded = false

  @State() state: ComponseEmailState
  private subscription: Subscription

  connectedCallback() {
    this.subscription = ComposeEmail.state$.subscribe(state => {
      this.state = { ...state }
    })
  }

  disconnectedCallback() {
    this.subscription.unsubscribe()
  }

  private menuItems = [
    {
      label: 'Inbox',
      icon: faInbox,
      url: '/'
    },
    {
      label: 'Starred',
      icon: faStar,
      url: '/emails/starred'
    },
    {
      label: 'About',
      icon: faQuestionCircle,
      url: '/about'
    }
  ].map(item => {
    item.url = AppRoute.getPath(item.url)
    return item
  })

  componentDidLoad() {
    this.isLoaded = true
  }

  render() {
    return (
      <Host class={`${this.isLoaded ? 'loaded' : ''}`}>
        <button onClick={ComposeEmail.activate} disabled={this.state.isActive}>
          Compose
        </button>
        <ul>
          {this.menuItems.map(menuItem => (
            <li>
              <Menu menuItem={menuItem}></Menu>
            </li>
          ))}
        </ul>
      </Host>
    )
  }
}

interface MenuItem {
  label: string
  icon: IconDefinition
  url: string
}

function Menu({ menuItem }: { menuItem: MenuItem }) {
  const id = newId('menu')
  const activePath = Router.path

  return (
    <a {...href(menuItem.url)} class={{ active: activePath === menuItem.url }}>
      <div class="menu-item">
        <x-icon id={id} icon={menuItem.icon}></x-icon>
        <label htmlFor={id}>{menuItem.label}</label>
      </div>
    </a>
  )
}
