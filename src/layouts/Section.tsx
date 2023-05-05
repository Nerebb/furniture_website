import classNames from 'classnames';
import React from 'react';

interface SectionProps {
  type?:
  "Default"
  | "CustomTitle",
  title?: string,
  children?: React.ReactNode
}

const Section = ({ type = "Default", title = type, children }: SectionProps) => {

  switch (type) {
    case "CustomTitle":
      return (
        <section className='py-8'>
          <>{children}</>
        </section>
      )
  }
  return (
    <section className='py-8'>
      <h1
        className={classNames(
          'w-full text-center text-2xl text-priBlack-500 font-bold underline underline-offset-8 mb-8',
          //Darkmode,
          'dark:text-white'
        )}
      >
        {title}
      </h1>
      <>{children}</>
    </section>
  )
}

export default Section