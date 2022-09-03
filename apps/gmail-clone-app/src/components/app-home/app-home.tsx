/* eslint-disable @stencil/required-jsdoc */
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core'
import { Email } from '../../email/service'
import { EmailSelection } from '../../states/emailSelection'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: true
})
export class AppHome {
  @Prop() emails: Email[]
  @Event() willLoadCalled: EventEmitter<void>

  componentWillLoad() {
    this.willLoadCalled.emit()
  }

  disconnectedCallback() {
    EmailSelection.reset()
  }

  render() {
    return (
      <div class="app-home">
        <email-list emails={this.emails}></email-list>
      </div>
    )
  }
}
