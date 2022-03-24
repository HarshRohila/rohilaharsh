import { faInbox, faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Component, Host, h } from '@stencil/core'
import { href } from '@stencil/router'
import { AppRoute } from '../../utils/AppRoute'
import newId from '../../utils/newId'

@Component({
  tag: 'side-bar',
  styleUrl: 'side-bar.scss',
  shadow: true
})
export class SideBar {
  menuItems = [
    {
      label: 'Inbox',
      icon: faInbox,
      url: '/'
    },
    {
      label: 'Starred',
      icon: faStar,
      url: '/profile/stencil'
    }
  ].map(item => {
    item.url = AppRoute.getPath(item.url)
    return item
  })

  render() {
    return (
      <Host>
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

  return (
    <a {...href(menuItem.url)}>
      <div class="menu-item">
        <x-icon id={id} icon={menuItem.icon}></x-icon>
        <label htmlFor={id}>{menuItem.label}</label>
      </div>
    </a>
  )
}
