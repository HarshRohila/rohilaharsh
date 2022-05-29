jest.mock('@stencil/router', () => {
  return {
    __esModule: true,
    href: jest.fn()
  }
})

import { newSpecPage } from '@stencil/core/testing'
import { EmailService } from '../../email/service'
import { EmailList } from './email-list'

describe('email-list | Component', () => {
  it('shows spinner on render', async () => {
    const promise = new Promise(res => setTimeout(() => res([]), 100))
    EmailService.getEmails = jest.fn().mockImplementation(() => promise)

    const page = await newSpecPage({
      components: [EmailList],
      html: '<email-list></email-list>'
    })

    const spinner = page.root.shadowRoot.querySelector('.spinner')
    expect(spinner).toBeTruthy()

    await promise
  })

  it('shows lists of emails', async () => {
    EmailService.getEmails = jest.fn().mockResolvedValue([
      {
        subject: 'sub1',
        datetime: new Date()
      },
      {
        subject: 'sub2',
        datetime: new Date()
      }
    ])
    const page = await newSpecPage({
      components: [EmailList],
      html: '<email-list></email-list>'
    })

    await page.waitForChanges()

    const emails = page.root.shadowRoot.querySelectorAll('email-bar')

    expect(emails.length).toBe(2)
  })
})
