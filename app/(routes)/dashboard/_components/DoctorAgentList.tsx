import { AIDoctorAgents } from '@/app/shared/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

const DoctorAgentList = () => {
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl '>AI Specialist Doctors</h2>
        <div className='mt-5'>
            <div  className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 rounded-2xl'>
            {AIDoctorAgents.map((agent, index) => (
                <DoctorAgentCard key={index} doctorAgent={agent} />
            ))}
        </div>
        </div>
        
    </div>
  )
}

export default DoctorAgentList
