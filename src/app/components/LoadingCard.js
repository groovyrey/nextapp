import React from 'react';

const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="card text-center">
      <div className="card-body">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{message}</span>
        </div>
        <h5 className="card-title mt-3">{message}</h5>
      </div>
    </div>
  );
};

export default LoadingCard;