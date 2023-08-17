import React from 'react';


const CommentList = ({ comments = [], handleRemoveComment, authService }) => {
  if (!comments.length) {
    return <h3>No Comments Yet</h3>;
  }

  return (
    <>
      <h3 className="p-5 display-inline-block" style={{ borderBottom: '1px dotted #1a1a1a' }}>
        Comments
      </h3>
      <div className="flex-row my-4">
        {comments.map((comment) => (
          <div key={comment._id} className="col-12 mb-3 pb-3">
            <div className="p-3 bg-dark text-light">
              <h5 className="card-header">
                {comment.commentAuthor ? (
                  <>
                    {comment.commentAuthor.username} commented{' '}
                    <span style={{ fontSize: '0.825rem' }}>on {comment.createdAt}</span>
                  </>
                ) : (
                  'Unknown commented'
                )}
              </h5>
              <p className="card-body">{comment.commentText}</p>
              {comment.commentAuthor._id === authService.getUserId() && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveComment(comment._id)}
                >
                  Remove Comment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
