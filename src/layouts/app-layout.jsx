import Header from '@/components/header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen pl-5 pr-5 sm:pl-10 sm:pr-10 lg:pl-20 lg:pr-20">
        <Header />
        <Outlet />
      </main>
      <div className='p-10 text-center bg-gray-800 mt-10'>Made by Rocky</div>
    </div>
  )
}

export default AppLayout