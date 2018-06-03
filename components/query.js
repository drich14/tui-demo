import React from 'react';
import withData from '../lib/withData';
import gql from 'graphql-tag';
import { Put } from 'typed-ui';
import { buildClientSchema } from 'graphql';
import { graphql, compose } from 'react-apollo';

export const getType = (name, schema) =>
	buildClientSchema(JSON.parse(schema))
		.getQueryType()
		.getFields()[name].type;

export const getName = query =>
	gql(query).definitions[0].selectionSet.selections[0].name.value;

const PutQuery = _query => ({ query, schema }) => {
	const name = getName(_query);
	return <Put type={getType(name, schema)} data={JSON.parse(query)[name]} />;
};

const withQuery = (url, query) =>
	graphql(
		gql`
			query Query($url: String!, $query: String!) {
				query(url: $url, query: $query)
			}
		`,
		{
			name: 'query',
			options: {
				variables: {
					url,
					query
				}
			}
		}
	);

export const withSchema = url =>
	graphql(
		gql`
			query GetSchema($url: String!) {
				getSchema(url: $url)
			}
		`,
		{
			name: 'getSchema',
			options: { variables: { url } }
		}
	);

const handleLoadingError = WC => ({ query, getSchema, ...props }) => (
	<div>
		{(query && query.loading) || (getSchema && getSchema.loading) ? (
			'loading'
		) : query && query.error ? (
			query.error.message
		) : getSchema && getSchema.error ? (
			getSchema.error.message
		) : (
			<WC
				query={query && query.query}
				schema={getSchema && getSchema.getSchema}
				{...props}
			/>
		)}
	</div>
);

const makeQuery = ({ url, query }) =>
	compose(
		withData,
		withQuery(url, query),
		withSchema(url),
		handleLoadingError
	)(PutQuery(query));

export const Query = props => {
	const _ = makeQuery(props);
	return <_ />;
};
