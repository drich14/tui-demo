import { compose } from 'react-apollo';
import { withData } from '../lib/withData';
import Action from '../lib/action';

export default compose(withData)(Action);
