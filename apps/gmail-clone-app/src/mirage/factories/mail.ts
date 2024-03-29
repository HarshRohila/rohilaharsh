import { Factory } from 'miragejs'
import faker from '@faker-js/faker'

export default Factory.extend({
  from() {
    return faker.name.findName()
  },

  fromEmail() {
    return faker.internet.email(this.from)
  },

  subject() {
    return faker.lorem.words(5)
  },

  text() {
    return faker.lorem.paragraph(5)
  },

  datetime() {
    return faker.datatype.datetime()
  },

  starred() {
    return faker.datatype.boolean()
  },

  imageUrl() {
    return faker.image.avatar()
  }
})
