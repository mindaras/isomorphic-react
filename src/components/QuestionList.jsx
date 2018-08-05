import React from "react";
import { connect } from "react-redux";
import TagList from './TagList';
import { Link } from 'react-router-dom';

const QuestionListItem = ({ title, tags, question_id }) => (
  <div className="mb-3">
    <h3>{title}</h3>
    <div className="mb-2"><TagList tags={tags} /></div>
    <div>
      <Link to={`/questions/${question_id}`}>
        <button>More Info!</button>
      </Link>
    </div>
  </div>
);

const QuestionList = ({ questions }) => (
  <div>
    {questions && questions.length ? (
      questions.map(question => (
        <QuestionListItem key={question.question_id} {...question} />
      ))
    ) : (
      <div>...Loading questions...</div>
    )}
  </div>
);

function mapStateToProps({ questions }) {
  return {
    questions
  };
}

export default connect(mapStateToProps)(QuestionList);
