import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Auth, Quiz } from 'page';
import HeaderContainer from 'containers/Base/HeaderContainer';

class App extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={HeaderContainer}/>
                <Route path="/auth" component={Auth}/>
                <Route path="/quiz" component={Quiz}/>
            </div>
        );
    }
}

export default App;