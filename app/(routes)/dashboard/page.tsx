"use client";
import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '../../../components/ui/button'
import DoctorAgentList from './_components/DoctorAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'


const page = () => {
  return (
    <div>
        <div className='flex items-center justify-between mb-10'>
            <h2 className='text-2xl font-bold'>My DashBoard</h2>
            
            <AddNewSessionDialog />
        </div>
          <HistoryList />

          <DoctorAgentList />
    </div>
  )
}

export default page
