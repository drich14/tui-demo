import { compose } from 'react-apollo';
import { withData } from '../lib/withData';
import Mutation from '../lib/mutation';

export default compose(withData)(Mutation);
