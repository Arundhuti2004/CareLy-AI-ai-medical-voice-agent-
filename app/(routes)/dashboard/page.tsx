
import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '../../../components/ui/button'
import DoctorAgentList from './_components/DoctorAgentList'

const page = () => {
  return (
    <div>
        <div className='flex items-center justify-between mb-10'>
            <h2 className='text-2xl font-bold'>My DashBoard</h2>
            <Button> Consult the Doctor </Button>
        </div>
          <HistoryList />

          <DoctorAgentList />
    </div>
  )
}

export default page
