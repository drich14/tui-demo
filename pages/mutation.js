import { Mutation } from '../components/mutation';

export default () => (
	<Mutation
		url="https://us1.prisma.sh/dylan-richardson-59e89b/hew/dev"
		mutation={'mutation M { createUser(data: { name: "x" }) { id name } }'}
	/>
);
