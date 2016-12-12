module.exports = {
  development: {
    client: 'mysql',
    connection: {
      'host': 'localhost',
      'user': 'root',
      'password': '',
      'database': 'node_edge'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
