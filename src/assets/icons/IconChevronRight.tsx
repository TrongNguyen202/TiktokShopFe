import PropTypes from 'prop-types';
import React from 'react';

export default function IconChevronRight({ className, ...rest }: { className: string; [key: string]: any }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`${className}`}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

IconChevronRight.propTypes = {
  className: PropTypes.string,
};
