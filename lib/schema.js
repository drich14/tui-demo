import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { __Schema, GraphQLString } from 'graphql';
import { Put } from 'typed-ui';
import { withLoadingHandler, withErrorHandler, withSchema } from './utils';

const PutSchema = ({ schema }) => {
	console.log(schema);
	return <Put type={GraphQLString} data={schema} />;
};

const Schema = ({ url }) =>
	compose(
		withSchema(url),
		withLoadingHandler,
		withErrorHandler
	)(PutSchema);

export default Schema;
