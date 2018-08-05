import React from "react";

const TagList = ({ tags }) => (
  <div>{tags.map(tag => <code key={tag}>{tag}</code>)}</div>
);

export default TagList;
