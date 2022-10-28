import React from 'react';
import { Provider } from 'react-redux';

/** redux store*/
import store from './../redux/store'

/** global react ruter dom component */
import { Router, Switch, Link } from 'react-router-dom'
import { history } from '../helper/history';

import { PrivateRoute } from './privateRoute';
import LandingPage from '../landing';
import { PublicRoute } from './publicRoute';

/** main page index */
import Index from './../app'

/** main page index */
import Preview from './../app/preview'

/** Uikit library inherite */
import './../../package/uikit'

/** custom styles */
import './../../styles/index.css'

/**
 * all routes
 *  
 * @param {*} NA
 * 
 * @return {obejct} route
 */


const App = (props) => (
    <Provider store = { store } >
        <Router history={ history }>
            <Switch>
                <PrivateRoute path="/" component={ Index } exact={true} />
                <Link to="/auth?id=:id&token=:token&domain_id=:domain_id" exact component={ LandingPage }/>
            </Switch>
        </Router>
    </Provider >
);
  
export default App;