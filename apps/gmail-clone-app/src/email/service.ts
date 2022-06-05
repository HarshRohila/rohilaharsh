/* eslint-disable @typescript-eslint/ban-ts-comment */
import { store } from '../orbitjs'
import mail from '../orbitjs/models/mail'
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
      attributes: Object.keys(mail.attributes)
    })

    const serializedEmail = MailSerializer.serialize(email).data

    serializedEmail.type = 'mail'
    serializedEmail.attributes.datetime = (
      serializedEmail.attributes.datetime as Date
    ).toISOString()

    await store.update(t => t.updateRecord(serializedEmail))
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
  fromEmail: string
  subject: string
  text: string
  datetime: Date
  starred: boolean
}
