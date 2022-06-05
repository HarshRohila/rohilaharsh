/* eslint-disable @typescript-eslint/ban-ts-comment */
import { store } from '../orbitjs'
import { EmailService } from './service'

describe('EmailService', () => {
  describe('saveEdittedEmail', () => {
    it('makes patch request with json api serializer email', async () => {
      store.update = jest.fn()

      // @ts-ignore
      await EmailService.saveEdittedEmail({ id: '1', from: 'test', datetime: new Date() })

      expect(store.update).toBeCalledTimes(1)
    })
  })
})
