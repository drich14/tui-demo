import React from 'react';
import { Mutation } from '../components/mutation';
import { __Schema, GraphQLString } from 'graphql';
import { compose } from 'react-apollo';
import { Put } from 'typed-ui';
import { withData } from '../lib/withData';
import { withSchema, withHandler } from '../components/query';

const PutSchema = ({ schema }) => (
	<Put type={GraphQLString} data={JSON.stringify(schema)} />
);

export default compose(
	withData,
	withSchema('https://us1.prisma.sh/dylan-richardson-59e89b/hew/dev'),
	withHandler
)(PutSchema);
