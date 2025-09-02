"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailsContext } from '@/context/UserDetailsContext';

type UserDetails = {
  email: string;
  name: string;
  credits: number;
};

const Provider = ({ children,}:Readonly<{
    children: React.ReactNode
}>) => {

  const {user} = useUser();
  const[userDetails, setUserDetails] = useState<any>();

  useEffect(() => {

    user && CreateNewUser();

  }, [user]);

  const CreateNewUser  = async () =>{
    const result = await axios.post('/api/users');
    console.log(result.data);
    setUserDetails(result.data);
    
  }
  return (
    <div>
      <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailsContext.Provider>
    </div>
  )
}

export default Provider 