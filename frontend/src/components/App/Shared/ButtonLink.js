import React from 'react'

const ButtonLink = ({children}) => {
  return (
    <div>
    <div className="flex items-center  px-4 py-2 rounded-full bg-gray-200  hover:bg-electric-violet text-black text-sm hover:text-white">
        {children}
        </div>
    </div>
  )
}

const ButtonLinkSecondary = ({children}) => {
    return (
      <div>
    <div className="flex items-center  px-4 py-2 rounded-full bg-aquamarine hover:bg-electric-violet text-black text-sm hover:text-white">
          {children}
          </div>
      </div>
    )
  }




export { ButtonLink }
export { ButtonLinkSecondary }