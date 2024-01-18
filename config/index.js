
import dotenv from 'dotenv'
dotenv.config()

export default  {
  development: {
    serviceTimeout: 30,
    scylla:{
        options: {
            contactPoints: [process.env.DB_HOST || 'localhost'],
            protocolOptions: {port: process.env.DB_PORT || 9042},
            keyspace: process.env.DB_NAME || 'accounts',
            localDataCenter: 'datacenter1',
        }
    },
    redis: {
      options:{
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || 'localhost',
      }
    },
  },
};