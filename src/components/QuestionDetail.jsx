import React from "react";
import Markdown from "react-markdown";
import TagList from "./TagList";
import { connect } from "react-redux";

const QuestionDetail = ({ title, body, answer_count, tags }) => (
  <div>
    <h3 className="mb-2">{title}</h3>
    {body ? (
      <div className="mb-3">
        <TagList tags={tags} />
        <Markdown source={body} />
        <div>{answer_count} Answers</div>
      </div>
    ) : (
      <div>Loading Questions</div>
    )}
  </div>
);

function mapStateToProps(state, ownProps) {
  return {
    ...state.questions.find(
      ({ question_id }) => question_id == ownProps.question_id
    )
  };
}

export default connect(mapStateToProps)(QuestionDetail);
