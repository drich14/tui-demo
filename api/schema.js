const { buildClientSchema, introspectionQuery } = require('graphql');
const { GraphQLClient } = require('graphql-request');

const getSchema = async (_, { url }) => {
	const client = new GraphQLClient(url);
	return JSON.stringify(await client.request(introspectionQuery));
};

module.exports = { getSchema };
