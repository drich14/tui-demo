import Action from '../components/action';

export default () => (
	<div>
		<h1>Query</h1>
		<Action
			url="https://us1.prisma.sh/dylan-richardson-59e89b/hew/dev"
			action={'query Q { users { name } }'}
		/>
	</div>
);
