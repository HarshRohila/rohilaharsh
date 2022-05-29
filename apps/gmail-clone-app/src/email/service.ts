/* eslint-disable @typescript-eslint/ban-ts-comment */
import { store } from '../orbitjs'
import { apiClient } from '../services/apiClient'
import { JsonApi } from '../utils/jsonapi'
export { EmailService, Email }

const EmailService = {
  async getEmails(): Promise<Email[]> {
    const response = await store.query(q => q.findRecords('mail'))
    console.log(response)

    // @ts-ignore
    return response.map(mail => {
      mail.attributes.id = mail.id
      mail.attributes.datetime = new Date(mail.attributes.datetime)
      return mail.attributes
    })
  },

  async saveEdittedEmail(email: Email) {
    const MailSerializer = JsonApi.newSerializer('mail', {
      attributes: ['from', 'subject', 'text', 'datetime', 'starred']
    })

    const serializedEmail = MailSerializer.serialize(email)
    await apiClient.patch(`mails/${email.id}`, serializedEmail)
  }
}

interface Email {
  id: string
  from: string
  subject: string
  text: string
  datetime: Date
  starred: boolean
}
