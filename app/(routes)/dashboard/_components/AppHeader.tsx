import { UserButton } from '@clerk/nextjs'
import React from 'react'

const menuOptions = [
    {
        id: 1,
        name : 'Home',
        path : '/Home'
    },
    {
        id: 2,
        name : 'History',
        path : '/history'
    },
    {
        id: 3,
        name : 'Pricing',
        path : '/pricing'
    },
    {
        id: 4,
        name : 'Profile',
        path : '/profile'
    }
]

function AppHeader() {
  return (
    <div className='w-full flex items-center justify-between p-5 border-b shadow-2xl px-10 lg:px-40 xl:px-40'>
      <div className="flex items-center gap-2">
        <div
          className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">CareLy</h1>
      </div>

      <div className='hidden md:flex gap-12 items-center'>
        {menuOptions.map((option,index) => (
          <div key={index}>
            <h2 className='hover:font-bold cursor-pointer transition-all duration-200'>{option.name}</h2>
          </div>
          ))}
        
      </div>

      <UserButton />
    </div>
  )
}

export default AppHeader
