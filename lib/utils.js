import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { buildClientSchema } from 'graphql';
import gql from 'graphql-tag';

export const isQuery = action => false;

export const getType = (action, schema) =>
	buildClientSchema(JSON.parse(schema))
		[isQuery(action) ? 'getQueryType' : 'getMutationType']()
		.getFields()[getName(action)].type;

export const getName = query =>
	gql(query).definitions[0].selectionSet.selections[0].name.value;

export const withPluck = WC => ({ query, getSchema, ...props }) => (
	<WC
		query={query && query.query}
		schema={getSchema && getSchema.getSchema}
		{...props}
	/>
);

export const withLoadingHandler = WC => props => {
	const { query, getSchema, loading = 'loading...' } = props;
	return (
		<div>
			{(query && query.loading) || (getSchema && getSchema.loading) ? (
				loading
			) : (
				<WC loading={loading} {...props} />
			)}
		</div>
	);
};

export const withErrorHandler = WC => props => {
	const { query, getSchema, onError = e => e } = props;
	return (
		<div>
			{query && query.error ? (
				onError(query.error.message)
			) : getSchema && getSchema.error ? (
				onError(getSchema.error.message)
			) : (
				<WC onError={onError} {...props} />
			)}
		</div>
	);
};
