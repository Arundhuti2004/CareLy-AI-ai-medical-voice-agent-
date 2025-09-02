import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react'
import { IconArrowRight } from '@tabler/icons-react';

export type DoctorAgent = {
    id: number;
    specialist: string;
    description: string;
    image?: string;
    agentPrompt: string;
    
}

type props={
    doctorAgent : DoctorAgent
}

const DoctorAgentCard = ({ doctorAgent }: props) => {
  return (
    <div>
        <Image src={(doctorAgent.image || '/placeholder.png') as string} alt={doctorAgent.specialist} width={200} height={300}
        className='w-full h-[250px] object-cover' />
      <h2 className='font-bold mt-1'>{doctorAgent.specialist}</h2>
      <p className='line-clamp-2 text-sm'>{doctorAgent.description}</p>
      <Button className='w-full mt-2'>Consultation with me <IconArrowRight /></Button>
    </div>
  )
}

export default DoctorAgentCard
