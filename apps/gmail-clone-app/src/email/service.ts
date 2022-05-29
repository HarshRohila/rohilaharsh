/* eslint-disable @typescript-eslint/ban-ts-comment */
import { store } from '../orbitjs'
import { apiClient } from '../services/apiClient'
import { JsonApi } from '../utils/jsonapi'
export { EmailService, Email }

const EmailService = {
  async getEmails(): Promise<Email[]> {
    const response = await store.query(q => q.findRecords('mail'))

    // @ts-ignore
    return response.map(deserialize)
  },

  async saveEdittedEmail(email: Email) {
    const MailSerializer = JsonApi.newSerializer('mail', {
      attributes: ['from', 'subject', 'text', 'datetime', 'starred']
    })

    const serializedEmail = MailSerializer.serialize(email)
    await apiClient.patch(`mails/${email.id}`, serializedEmail)
  },

  async getEmail(emailId: string): Promise<Email> {
    const email = await store.query(q => q.findRecord({ type: 'mail', id: emailId }))

    return deserialize(email)
  }
}

function deserialize(emailJsonApiRecord: any) {
  const mail = emailJsonApiRecord
  mail.attributes.id = mail.id
  mail.attributes.datetime = new Date(mail.attributes.datetime)
  return mail.attributes
}

interface Email {
  id: string
  from: string
  subject: string
  text: string
  datetime: Date
  starred: boolean
}
