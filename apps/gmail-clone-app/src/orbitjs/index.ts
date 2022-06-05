/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MemorySource } from '@orbit/memory'
import { RecordSchema } from '@orbit/records'
import { JSONAPISource, JSONAPISerializers } from '@orbit/jsonapi'
import { buildSerializerSettingsFor, buildInflector } from '@orbit/serializers'

import { API_URL } from '../utils/constants'
import {
  Coordinator,
  RequestStrategy,
  SyncStrategy,
  LogLevel,
  EventLoggingStrategy
} from '@orbit/coordinator'
import models from './models'

export { OrbitJs, store }

const OrbitJs = {
  async activate() {
    const coordinator = new Coordinator({
      sources: [memory, remote]
    })

    // Query the remote server whenever the memory source is queried
    coordinator.addStrategy(
      new RequestStrategy({
        source: 'memory',
        on: 'beforeQuery',

        target: 'remote',
        action: 'query',

        blocking: transform => {
          // @ts-ignore
          const data = memory.cache.query(transform)

          if (!data) {
            return true
          }
          if (Array.isArray(data) && !data.length) {
            return true
          }

          return false
        }
      })
    )

    // Update the remote server whenever the memory source is updated
    coordinator.addStrategy(
      new RequestStrategy({
        source: 'memory',
        on: 'beforeUpdate',

        target: 'remote',
        action: 'update',

        blocking: false
      })
    )

    // Sync all changes received from the remote server to the memory source
    coordinator.addStrategy(
      new SyncStrategy({
        source: 'remote',
        target: 'memory',
        blocking: false
      })
    )

    coordinator.addStrategy(new EventLoggingStrategy())

    // `activate` resolves when all strategies have been activated
    await coordinator.activate({ logLevel: LogLevel.Info }).then(() => {
      console.log('Coordinator will be chatty')
    })
  }
}

const schema = new RecordSchema({
  models
})
const memory = new MemorySource({ schema })

const remote = new JSONAPISource({
  schema,
  name: 'remote',
  host: API_URL,
  serializerSettingsFor: buildSerializerSettingsFor({
    sharedSettings: {
      // Optional: Custom `pluralize` / `singularize` inflectors that know about
      // your app's unique data.
      inflectors: {
        pluralize: buildInflector(
          { person: 'people' }, // custom mappings
          input => `${input}s` // naive pluralizer, specified as a fallback
        ),
        singularize: buildInflector(
          { people: 'person' }, // custom mappings
          arg => arg.substring(0, arg.length - 1) // naive singularizer, specified as a fallback
        )
      }
    },
    // Serialization settings according to the type of serializer
    settingsByType: {
      [JSONAPISerializers.ResourceType]: {
        serializationOptions: { inflectors: ['pluralize'] }
      }
    }
  })
})

const store = memory
