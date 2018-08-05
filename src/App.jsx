import React from "react";
import { connect } from "react-redux";
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import { Route, Link } from 'react-router-dom';

const AppDisplay = ({ test }) => (
  <div>
    <Link to="/">
      <h1>Isomorphic React</h1>
    </Link>
    <div>
      <Route exact path="/" render={() => <QuestionList />} />
      <Route exact path="/questions/:id" render={({match}) => <QuestionDetail question_id={match.params.id} />} />
    </div>
  </div>
);

function mapStateToPropps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToPropps)(AppDisplay);
