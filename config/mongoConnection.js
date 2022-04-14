const { MongoClient, ServerApiVersion } = require('mongodb');

const settings = {
   db_name: 'sample_training',
   password: 'food'
};

const mongoConfig = settings.mongoConfig;
const uri = `mongodb+srv://hci-user:${settings.password}@hci.hy7nw.mongodb.net/${settings.db_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let _connection = undefined;
let _db = undefined;

module.exports = {
    connectToDb: async () => {
        if (!_connection) {
            __connection = await client.connect();
            _db = await client.db()
        }

        return _db;
    },
    closeConnection: async() => {
       await __connection.close()
    },
};