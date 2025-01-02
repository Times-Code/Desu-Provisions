import React from 'react'

const Footer = () => {
  return (
    <div className="flex w-full px-6 flex-col items-center flex-wrap justify-evenly gap-5 mt-6 bg-rose-50 p-4 sm:flex-row dark:border-white/5">
      <p className="text-md text-gray-600 dark:text-gray-100">
        Copyright © {new Date().getFullYear()}{' '}
        <a
          href="https://veracityinfotronics.in/"
          className=" text-rose-600  text-lg hover:text-red-500 "
        >
          Veracityinfotronics
        </a>{' '}
      </p>
      <p className="text-md text-gray-600 dark:text-gray-100">
        Developed by {" "}
        <a
          href="https://www.timescode.in/"
          className=" text-rose-600  text-lg hover:text-red-500 "
        >
          TimesCode
        </a>{' '}
      </p>
    </div>
  )
}

export default Footer;