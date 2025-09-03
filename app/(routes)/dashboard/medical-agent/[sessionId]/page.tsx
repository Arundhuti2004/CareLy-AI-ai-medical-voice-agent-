"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { DoctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi  from '@vapi-ai/web';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AssemblyAITranscriber from "@vapi-ai/web"




type SessionDetails={
  id:number,
  notes:string,
  sessionId:string,
  report:JSON,
  selectedDoctor:DoctorAgent,
  createdOn:string,
  voiceId:string
}

type Message={
  role:string,
  text:string,
  transcript?: string;
  transcriptType?: string;
  type?: string;
  provider?: string;
  languageCode?: string;
}

const   Page = () => {
  const {sessionId} = useParams();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router= useRouter();
  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId])

  const GetSessionDetails =async ()=>{
    const result = await fetch(`/api/session-chat?sessionId=${sessionId}`);
    const data = await result.json();

    console.log(data);
    setSessionDetails(data);

  }

// Define listener functions outside
const onCallStart = () => {
  console.log('Call started');
  setCallStarted(true);
};

const onCallEnd = () => {
  console.log('Call ended');
  setCallStarted(false);
};

const onMessage = (message: any) => {
  if (message.type === 'transcript') {
    const {role,transcriptType,transcript} = message;
    console.log(`${message.role}: ${message.transcript}`);
    if(transcriptType==='partial')
    setLiveTranscript(transcript);
    setCurrentRole(role);
  }else if(message.type==='final'){
    setMessages((prev)=>[...prev,{ role: message.role, text: message.transcript ?? message.text }]);
    setLiveTranscript("");
    setCurrentRole(null);
    toast.success('Your Report Is Generated')
    router.replace('/dashboard')
  }
};

// Add this after your listener functions
useEffect(() => {
  if (!vapiInstance) return;

  const handleSpeechStart = () => {
    console.log('Assistant started speaking');
    setCurrentRole('assistant');
  };

  const handleSpeechEnd = () => {
    console.log('Assistant stopped speaking');
    setCurrentRole('user');
  };

  vapiInstance.on('speech-start', handleSpeechStart);
  vapiInstance.on('speech-end', handleSpeechEnd);

  return () => {
    vapiInstance.off('speech-start', handleSpeechStart);
    vapiInstance.off('speech-end', handleSpeechEnd);
  };
}, [vapiInstance]);




const StartCall = async () => {
try {
    if (!vapiInstance) { 

       if (
        !sessionDetails ||
        !sessionDetails.selectedDoctor ||
        !sessionDetails.selectedDoctor.voiceId
      ) {
        toast.error("Doctor details not loaded. Please wait and try again.");
        return;
      }
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!); 
      setVapiInstance(vapi);

      const VapiAgentConfig={
        name:'AI Medical Doctor Voice Agent',
        firstMessage:'Hello, I am your AI medical assistant. How can I help you today?',
        
        voice:{
          provider:"vapi" as "vapi",
          voiceId:sessionDetails?.selectedDoctor.voiceId ,
        },
        model:{
          provider:"google" as "google",
          model:"gemini-2.0-flash",
          messages:[
            {
              role:"system",
              content:sessionDetails?.selectedDoctor.agentPrompt || "You are a helpful medical AI assistant. Ask brief questions and give short, clear advice."
            },
          ],
        },
  
      }
  
      // Use the function references here
      vapi.on('call-start', onCallStart);
      vapi.on('call-end', onCallEnd);
      vapi.on('message', onMessage);
  
      
      //@ts-ignore
      await vapi.start(VapiAgentConfig);
    } 
} catch (error) {
  console.error('Error starting call:', error);
};
}

// Later, when ending the call
const endCall = async () => {
//  setLoading(true);
  if (!vapiInstance) return;

  vapiInstance.stop();
  // Pass the same function references to remove them
  vapiInstance.off('call-start', onCallStart);
  vapiInstance.off('call-end', onCallEnd);
  vapiInstance.off('message', onMessage);

  setCallStarted(false);
  setVapiInstance(null);

  //const result = await GenerateReport();

  //setLoading(false);
};

/*  const GenerateReport=async()=>{
    const result = await axios.post('/api/medical-report',{

      messages: messages,
      sessionDetails: sessionDetails,
      sessionId: {sessionId}
  })

      console.log(result.data);
      return result.data;

}*/





    return (
    <div className='p-5 border rounded-lg border-gray-200'>
    <div className='flex justify-between items-center'>
       <h2 className='p-2 border rounded-md flex items-center'>
    <Circle
      className={`h-4 w-4 ${callStarted ? 'text-green-500' : 'text-red-400'}`}
    />
    <span className='ml-2 text-sm'>
      {callStarted ? 'In Call' : 'Not in Call'}
    </span>
    </h2>
    </div>
    {sessionDetails &&
    <div className='flex items-center flex-col mt-10'>
      <Image src={sessionDetails.selectedDoctor.image || '/placeholder.png'} alt={sessionDetails?.selectedDoctor?.specialist || 'Doctor'} width={120} height={120} className='h-[100px] w-[100px] object-cover rounded-3xl'/>
      <h2 className='mt-2 text-lg'>{sessionDetails?.selectedDoctor?.specialist || 'Unknown Doctor'}</h2>
      <p className=' text-sm text-gray-400'>AI Medical Voice Agent</p>


      <div className='mt-12 overflow-auto flex flex-col items-center px:10 md:px-28 lg:px-52 xl:px-72'>
        {messages?.slice(-4).map((msg, index) => (

            <h2 className='text-grey-400 p-2' key={index}>{msg.role}: {msg.text}</h2>

        ))}
        <h2 className='text-grey-400'>Assistant Msg</h2>
      {liveTranscript &&  <h2 className='text-lg'>{currentRole}: {liveTranscript}</h2>}
      </div>

    {!callStarted? <Button className='mt-20' onClick={StartCall} disabled={loading}>
      {loading ? <Loader className='animate-spin' /> : <PhoneCall />} Start Call</Button>
      : <Button  variant={`destructive`} className='mt-20' onClick={endCall} disabled={loading}>
    {loading ? <Loader className='animate-spin' /> : <PhoneOff />}  End Call</Button>
      }
    </div>}
    </div>
    )

  }
export default  Page;
