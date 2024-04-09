import PropTypes from 'prop-types';

export default function RedoIcon({ className, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`${className}`}
      {...rest}
      fill="currentColor"
    >
      <path d="M9 18h3v-2H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h6v3l5-4-5-4v3H9c-2.757 0-5 2.243-5 5s2.243 5 5 5z" />
    </svg>
  );
}

RedoIcon.propTypes = {
  className: PropTypes.string,
};
