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

const usersType = schema =>
	buildClientSchema(JSON.parse(schema))._typeMap.Query._fields.users.type;

const Users = ({ data: { loading, error, query, getSchema } }) => (
	<div>
		<div>
			{error ? (
				error.message
			) : loading ? (
				'loading'
			) : (
				<Put
					type={usersType(getSchema)}
					data={JSON.parse(query).users}
				/>
			)}
		</div>
		<style jsx global>{`
			body {
				background: #ccc;
			}
		`}</style>
	</div>
);

const usersQuery = gql`
	query Query($url: String!, $query: String!) {
		getSchema(url: $url)
		query(url: $url, query: $query)
	}
`;

const usersOptions = {
	options: {
		variables: {
			url: 'https://us1.prisma.sh/dylan-richardson-59e89b/hew/dev',
			query: 'query Users { users { name } }'
		}
	}
};

export default withData(Users, usersQuery, usersOptions);
