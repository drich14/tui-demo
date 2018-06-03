import { compose } from 'react-apollo';
import { withData } from '../lib/withData';
import Query from '../lib/query';

export default compose(withData)(Query);
