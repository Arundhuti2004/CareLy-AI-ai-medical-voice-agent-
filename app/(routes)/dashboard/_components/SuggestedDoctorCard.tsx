import Image from 'next/image'
import React from 'react'
import { DoctorAgent } from './DoctorAgentCard'

type props = {
     doctorAgent : DoctorAgent,
     setSelectedDoctor: any,
     selectedDoctor: DoctorAgent,
}
const SuggestedDoctorCard = ({ doctorAgent , setSelectedDoctor , selectedDoctor}: props) => {
  return (
    <div className={`p-3 border rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 cursor-pointer ${selectedDoctor?.id === doctorAgent.id ? 'border-blue-500' : ''}`} onClick={() => setSelectedDoctor(doctorAgent)}>
      <Image src={(doctorAgent?.image || '/placeholder.png') as string}
       alt={doctorAgent?.specialist} 
       width={70} height={70}  
       className='rounded-4xl w-[50px] h-[50px] object-cover' />

      {/* <h2 className='font-bold text-sm'>{doctorAgent?.specialist}</h2> */}

       <p className='text-xs'>{doctorAgent?.description}</p>
    </div>
  )
}

export default SuggestedDoctorCard
