import { Factory } from 'miragejs'
import { faker } from '@faker-js/faker'

export default Factory.extend({
  text() {
    return faker.name.findName()
  }
})
