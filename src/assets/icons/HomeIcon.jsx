import PropTypes from 'prop-types'

export default function HomeIcon({ className, ...rest }) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`${className}`}
      {...rest}
    >
      <g clipPath='url(#clip0_157_36)'>
        <path
          d='M19.9688 23.2492H4.03125C2.84231 23.2492 1.875 22.282 1.875 21.093V9.74829C1.875 9.3341 2.21077 8.99829 2.625 8.99829C3.03923 8.99829 3.375 9.3341 3.375 9.74829V21.093C3.375 21.4549 3.66938 21.7492 4.03125 21.7492H19.9688C20.3306 21.7492 20.625 21.4549 20.625 21.093V9.74829C20.625 9.3341 20.9608 8.99829 21.375 8.99829C21.7892 8.99829 22.125 9.3341 22.125 9.74829V21.093C22.125 22.2819 21.1577 23.2492 19.9688 23.2492Z'
          fill='currentColor'
        />
        <path
          d='M23.25 12.3731C23.058 12.3731 22.8661 12.2999 22.7197 12.1534L13.3921 2.82587C12.6245 2.05825 11.3755 2.05825 10.6079 2.82587L1.28033 12.1534C0.987457 12.4464 0.512566 12.4464 0.219691 12.1534C-0.0732305 11.8606 -0.0732305 11.3857 0.219691 11.0928L9.54725 1.76518C10.8997 0.412745 13.1003 0.412745 14.4527 1.76518L23.7803 11.0927C24.0732 11.3857 24.0732 11.8605 23.7803 12.1534C23.6339 12.2999 23.4419 12.3731 23.25 12.3731Z'
          fill='currentColor'
        />
        <path
          d='M15 23.2493H9C8.58577 23.2493 8.25 22.9135 8.25 22.4993V15.843C8.25 14.5507 9.30141 13.4993 10.5938 13.4993H13.4062C14.6986 13.4993 15.75 14.5507 15.75 15.843V22.4993C15.75 22.9135 15.4142 23.2493 15 23.2493ZM9.75 21.7493H14.25V15.843C14.25 15.3778 13.8715 14.9993 13.4062 14.9993H10.5938C10.1285 14.9993 9.75 15.3778 9.75 15.843V21.7493Z'
          fill='currentColor'
        />
      </g>
      <defs>
        <clipPath id='clip0_157_36'>
          <rect width='24' height='24' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

HomeIcon.propTypes = {
  className: PropTypes.string,
}