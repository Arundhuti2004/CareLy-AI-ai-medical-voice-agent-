
import React, { useState } from 'react'
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import DoctorAgentCard, { DoctorAgent } from './DoctorAgentCard'
import { Loader2 } from 'lucide-react'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'


const AddNewSessionDialog = () => {
    const [note,setNote] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [doctorSuggestion, setDoctorSuggestion] = useState<DoctorAgent[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent>();
    const router = useRouter();
    const onClickNext=async()=>{
      try {
          setLoading(true);
          const result = await axios.post('/api/suggest-doctors', {
              notes: note
          });
  
          console.log(result.data);
          setDoctorSuggestion(result.data);
          setLoading(false);
      } catch (error) {
          console.error(error);
          setLoading(false);
      }
    }

      const onStartConsultation = async () => {
        setLoading(true);
        const result = await axios.post('/api/session-chat', {
          notes: note,
          selectedDoctor: selectedDoctor
        });

        console.log(result.data);
        if(result.data.sessionId){
          console.log(result.data.sessionId);
          router.push(`/dashboard/medical-agent/`+result.data.sessionId);
        }
          setLoading(false);

      }

  return (
    <div>
      <Dialog>
  <DialogTrigger asChild>
    <Button className='mt-3'>+ Book a Consultation</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Basic Details</DialogTitle>
      <DialogDescription asChild>
        { doctorSuggestion.length === 0 ?
          <div><h2>Add Symptoms or Any Other Details</h2>
            <textarea onChange={(e) => setNote(e.target.value)} className='h-[200px] w-full mt-1' rows={4} placeholder='Describe your symptoms...'></textarea>
            </div> : <div>
              <h2>Select the Doctor</h2>
              <div className='grid grid-cols-2 gap-5'>
              {doctorSuggestion.map((doctor, index) =>
               <SuggestedDoctorCard key={index} doctorAgent={doctor} setSelectedDoctor={() => setSelectedDoctor(doctor)}
               //@ts-ignore
               selectedDoctor={selectedDoctor}
               />
              )}
              </div>
            </div>
        }
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <DialogClose asChild>
          
            <Button variant={"outline"}>Cancel</Button>
        </DialogClose>
        { doctorSuggestion.length === 0 ?
        <Button disabled={!note || loading} onClick={()=>onClickNext()}>
        Next { loading ? <Loader2 className='animate-spin' /> : <IconArrowRight />}</Button>
        :
        <Button disabled={loading || !selectedDoctor} onClick={() => onStartConsultation()}>
          Start consultation
          { loading ? <Loader2 className='animate-spin' /> : <IconArrowRight />}
          </Button>
          }
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default AddNewSessionDialog
