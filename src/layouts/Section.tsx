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
        <section className='mt-16'>
          <>{children}</>
        </section>
      )
  }
  return (
    <section className='mt-16'>
      <h1 className='w-full text-center text-2xl text-priBlack-500 font-bold underline underline-offset-8 mb-8'>{title}</h1>
      <>{children}</>
    </section>
  )
}

export default Section