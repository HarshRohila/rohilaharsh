import {
  Serializer as JSONAPISerializer,
  Deserializer as JSONAPIDeserializer,
} from 'jsonapi-serializer';

export { JsonApi };

const JsonApi = {
  deserialize(jsonapiPayload: Record<string, any>) {
    return new Promise((res, rej) => {
      new JSONAPIDeserializer({
        keyForAttribute: 'camelCase',
      }).deserialize(jsonapiPayload, function (err, deserializedOutput) {
        if (err) {
          rej(err);
        }
        res(deserializedOutput);
      });
    });
  },

  newSerializer(type, options) {
    return new JSONAPISerializer(type, {
      attributes: options.attributes,
      keyForAttribute: 'camelCase',
    });
  },
};
