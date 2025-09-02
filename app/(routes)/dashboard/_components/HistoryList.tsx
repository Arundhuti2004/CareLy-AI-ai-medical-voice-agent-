"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';

const HistoryList = () => {
    const [historyList , setHistoryList] = useState([]);

  return (
    <div className='mt-8'>
      {historyList.length === 0 ?
        <div className='flex items-center flex-col justify-center p-7 border border-dashed'>
            <Image src={'/medical-assistance.png'} alt='No history available' width={150} height={150} />
            <h2 className='text-xl font-bold mt-2'>No Recent Consultation</h2>
            <p>It looks like you haven't had any consultations yet.</p>
            <AddNewSessionDialog />
      </div> 
      : 
        <div>
          
           List
          
        </div>
      }
    </div>
  )
}

export default HistoryList
