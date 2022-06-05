jest.mock('@stencil/router', () => {
  return {
    __esModule: true,
    href: jest.fn()
  }
})

import { newSpecPage } from '@stencil/core/testing'
import { EmailList } from './email-list'
import { h } from '@stencil/core'

describe('email-list | Component', () => {
  it('shows lists of emails', async () => {
    const emails = [
      {
        subject: 'sub1',
        datetime: new Date()
      },
      {
        subject: 'sub2',
        datetime: new Date()
      }
    ]
    const page = await newSpecPage({
      components: [EmailList],
      template: () => <email-list emails={emails}></email-list>
    })

    await page.waitForChanges()

    const emailsElement = page.root.shadowRoot.querySelectorAll('email-bar')

    expect(emailsElement.length).toBe(2)
  })
})
