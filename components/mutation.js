import React, { Component } from 'react';
import withData from '../lib/withData';
import gql from 'graphql-tag';
import { Put } from 'typed-ui';
import { buildClientSchema, GraphQLString } from 'graphql';
import { graphql, compose } from 'react-apollo';
import { withSchema, getType, getName } from './query';

const PutMutation = mutation => ({ mutate, schema }) => {
	const name = getName(mutation);
	return <Put type={getType(name, schema)} data={JSON.parse(mutate)[name]} />;
};

const withMutation = (url, mutation) =>
	graphql(
		gql`
			mutation Mutation($url: String!, $mutation: String!) {
				mutate(url: $url, mutation: $mutation)
			}
		`,
		{
			name: 'mutation',
			options: {
				variables: {
					url,
					mutation
				}
			}
		}
	);

const handleLoadingError = mutation => WC =>
	class Handler extends Component {
		constructor(props) {
			super(props);
			this.state = { mutate: null };
			this.name = getName(mutation);
		}

		componentDidMount() {
			this.props
				.mutation()
				.then(({ data: { mutate } }) => this.setState({ mutate }))
				.catch(console.error);
		}

		render() {
			const { getSchema } = this.props;
			return (
				<div>
					{(getSchema && getSchema.loading) || !this.state.mutate ? (
						'loading'
					) : getSchema && getSchema.error ? (
						getSchema.error.message
					) : (
						<WC
							schema={getSchema.getSchema}
							mutate={this.state.mutate}
							{...this.props}
						/>
					)}
				</div>
			);
		}
	};

const makeMutation = ({ url, mutation }) =>
	compose(
		withData,
		withMutation(url, mutation),
		withSchema(url),
		handleLoadingError(mutation)
	)(PutMutation(mutation));

export const Mutation = props => {
	const _ = makeMutation(props);
	return <_ />;
};
