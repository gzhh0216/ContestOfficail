import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Introduce from '../containers/Introduce';
import NotFound from '../containers/NotFound';
import Grade from '../containers/Grade';
import App from '../containers/App.js';
import Message from '../containers/Message';


class RouteMap extends React.Component {
updateHandle() { 
    console.log('记录PV');
    //PV统计
}
     render() {
        return ( 
            <Router 
             history={this.props.history} 
             onUpdate={this.updateHandle.bind(this)}> 
                <Route path='/' component={App}> 
                    <IndexRoute component={Message}/>
                    <Route path='/home' component={Introduce}/>
                    <Route path='/grade' component={Grade}/>
                    <Route path='/message' component={Message}/>
                    <Route path="*" component={NotFound}/> 
                </Route> 
            </Router> 
        )
    } 
}

export default RouteMap;

