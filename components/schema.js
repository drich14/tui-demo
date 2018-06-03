import { compose } from 'react-apollo';
import { withData } from '../lib/withData';
import Schema from '../lib/schema';

export default compose(withData)(Schema);
