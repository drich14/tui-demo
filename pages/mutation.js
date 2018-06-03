import Action from '../components/action';

export default () => (
	<div>
		<h1>Mutation</h1>
		<Action
			url="https://us1.prisma.sh/dylan-richardson-59e89b/hew/dev"
			action={
				'mutation M { createUser(data: { name: "y" }) { id name } }'
			}
		/>
	</div>
);
