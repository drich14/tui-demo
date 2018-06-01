const { GraphQLClient } = require('graphql-request');

const query = async (_, { url, query }) => {
	const client = new GraphQLClient(url);
	const data = await client.request(query);
	return JSON.stringify(data);
};

module.exports = { query };
