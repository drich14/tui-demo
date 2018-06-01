import React from 'react';
import withData from '../lib/withData';
import gql from 'graphql-tag';
import { Put } from 'typed-ui';
import {
	GraphQLString,
	GraphQLList,
	GraphQLObjectType,
	GraphQLNonNull,
	buildClientSchema
} from 'graphql';
import { graphql } from 'react-apollo';

const getType = (name, schema) =>
	buildClientSchema(JSON.parse(schema))
		.getQueryType()
		.getFields()[name].type;

const Query = name => ({ data: { loading, error, query, getSchema } }) => (
	<div>
		{error ? (
			error.message
		) : loading ? (
			'loading'
		) : (
			<Put
				type={getType(name, getSchema)}
				data={JSON.parse(query)[name]}
			/>
		)}
	</div>
);

const queryQuery = gql`
	query Query($url: String!, $query: String!) {
		getSchema(url: $url)
		query(url: $url, query: $query)
	}
`;

const usersOptions = (url, query) => ({
	options: {
		variables: {
			url,
			query
		}
	}
});

const getName = query =>
	gql(query).definitions[0].selectionSet.selections[0].name.value;

export const query = (url, query) =>
	withData(
		Query(getName(query)),
		graphql(queryQuery, usersOptions(url, query))
	);


