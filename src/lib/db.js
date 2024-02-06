import cassandra from 'cassandra-driver'
import config from '../../config/index.js'

const enviropment = process.env.NODE_ENV || 'development'

export const client = new cassandra.Client(
  config[enviropment].scylla.options
)

const TABLES = {
  USERS: 'users',
  TOKENS: 'tokens',
}

const UnderscoreCqlToCamelCaseMappings = cassandra.mapping.UnderscoreCqlToCamelCaseMappings

export const mapper = new cassandra.mapping.Mapper(client, {
  models: {

    users: {
      tables: [
        TABLES.USERS,
        {name: 'users_by_email', isView: true},
        {name: 'users_by_activation_link', isView: true}
      ],
      mappings: new UnderscoreCqlToCamelCaseMappings()
    },
    tokens:{
      tables: [
        TABLES.TOKENS,
        {name: 'tokents_by_user', isView: true},
        {name: 'tokents_by_refresh', isView: true}
      ],
      mappings: new UnderscoreCqlToCamelCaseMappings()
    },
  }
})

export const users = mapper.forModel('users')
export const tokens = mapper.forModel('tokens')

export const normalize = (objects) => {
  const isArray = Array.isArray(objects)

  if (!objects || isArray && !objects.length) {
    return objects
  }

  objects = isArray ? objects : [objects]
  objects = objects.filter(obj => typeof obj === 'object')

  objects.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Date) {
        obj[key] = obj[key].getTime()
      } else if (obj[key] instanceof cassandra.types.Uuid) {
        obj[key] = obj[key].toString()
      } else if (obj[key] instanceof cassandra.types.Long) {
        obj[key] = Number(obj[key])
      } else if (obj[key] instanceof Array) {
        obj[key] = (obj[key]).map(e => (e instanceof cassandra.types.Uuid) ? e.toString() : e)
      }
    })
  })
  return isArray ? objects : objects[0]
}