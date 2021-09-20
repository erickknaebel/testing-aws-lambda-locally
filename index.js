const MongoClient = require("mongodb").MongoClient;
const username = process.env.MongoAtlasUser;
const password = process.env.MongoAtlasPassword;
const MONGODB_URI =
`mongodb+srv://${username}:${password}@awsTest.hsafn.mongodb.net/sample_mflix?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.handler = async (event, context) => {
  const client = await new MongoClient(MONGODB_URI, connectionParams);
  await client.connect();

  const cursor = client
    .db("sample_mflix")
    .collection("movies")
    .find()
    .limit(10);

  const records = await cursor.toArray();
  const views = await formatData(records);
  const response = {
    statusCode: 200,
    body: JSON.stringify(views),
  };

  return response;
};

async function formatData(records) {
    const array = [];
    records.forEach(document => {
        const doc = {};
        Object.keys(document).forEach( key => {
            if (key === 'plot' || key === 'title') {
                doc[key] = document[key];
            }
            array.push(doc);
        })
    });
    return array;
}
