import PropTypes from 'prop-types';

export default function NoteIcon({ className, ...rest }) {
  return (
    <svg
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.8806 2.72607H22.4017C25.4643 2.72605 27.8902 2.72603 29.7887 2.98128C31.7425 3.24397 33.324 3.79745 34.5711 5.04461C35.8183 6.29177 36.3718 7.87321 36.6345 9.82707C36.8897 11.7256 36.8897 14.1514 36.8897 17.2141V24.0682C36.8897 27.1309 36.8897 29.5567 36.6345 31.4552C36.3718 33.4091 35.8183 34.9905 34.5711 36.2377C33.324 37.4848 31.7425 38.0383 29.7887 38.301C27.8902 38.5563 25.4643 38.5562 22.4017 38.5562H18.8806C15.8179 38.5562 13.3921 38.5563 11.4936 38.301C9.53971 38.0383 7.95827 37.4848 6.71111 36.2377C5.46395 34.9905 4.91047 33.4091 4.64778 31.4552C4.39253 29.5567 4.39255 27.1309 4.39258 24.0682V17.2141C4.39255 14.1514 4.39253 11.7256 4.64778 9.82707C4.91047 7.87321 5.46395 6.29177 6.71111 5.04461C7.95827 3.79745 9.53971 3.24397 11.4936 2.98128C13.3921 2.72603 15.8179 2.72605 18.8806 2.72607ZM11.8267 5.45876C10.15 5.68418 9.18401 6.10693 8.47872 6.81222C7.77343 7.5175 7.35069 8.48349 7.12527 10.1602C6.89501 11.8728 6.89236 14.1304 6.89236 17.3081V23.9742C6.89236 27.1519 6.89501 29.4095 7.12527 31.1221C7.35069 32.7988 7.77343 33.7648 8.47872 34.4701C9.18401 35.1754 10.15 35.5981 11.8267 35.8235C13.5393 36.0538 15.7969 36.0564 18.9746 36.0564H22.3076C25.4854 36.0564 27.743 36.0538 29.4556 35.8235C31.1323 35.5981 32.0982 35.1754 32.8035 34.4701C33.5088 33.7648 33.9316 32.7988 34.157 31.1221C34.3872 29.4095 34.3899 27.1519 34.3899 23.9742V17.3081C34.3899 14.1304 34.3872 11.8728 34.157 10.1602C33.9316 8.48349 33.5088 7.5175 32.8035 6.81222C32.0982 6.10693 31.1323 5.68418 29.4556 5.45876C27.743 5.22851 25.4854 5.22585 22.3076 5.22585H18.9746C15.7969 5.22585 13.5393 5.22851 11.8267 5.45876ZM12.7252 13.9751C12.7252 13.2848 13.2848 12.7252 13.9751 12.7252H27.3072C27.9975 12.7252 28.5571 13.2848 28.5571 13.9751C28.5571 14.6654 27.9975 15.225 27.3072 15.225H13.9751C13.2848 15.225 12.7252 14.6654 12.7252 13.9751ZM12.7252 20.6411C12.7252 19.9508 13.2848 19.3913 13.9751 19.3913H27.3072C27.9975 19.3913 28.5571 19.9508 28.5571 20.6411C28.5571 21.3314 27.9975 21.891 27.3072 21.891H13.9751C13.2848 21.891 12.7252 21.3314 12.7252 20.6411ZM12.7252 27.3072C12.7252 26.6169 13.2848 26.0573 13.9751 26.0573H22.3076C22.9979 26.0573 23.5575 26.6169 23.5575 27.3072C23.5575 27.9975 22.9979 28.5571 22.3076 28.5571H13.9751C13.2848 28.5571 12.7252 27.9975 12.7252 27.3072Z"
        fill="currentColor"
      />
    </svg>
  );
}

NoteIcon.propTypes = {
  className: PropTypes.string,
};