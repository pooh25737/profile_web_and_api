'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/dist/server/api-utils"

export const createCamps = async(prevState:any,formData:FormData)=>{
    const rawData = Object.fromEntries(formData)
    console.log(rawData)
    // prisma.camp.create()
    // revalidatePath('/camp')
    // redirect('/')
    await new Promise((resolve)=>setTimeout(resolve,1000))
    
    return 'add ok'
}

export const fetchCamps = async()=>{
    // prisma.camp.findMany({})
    const camps = [
        {id:1,title:'korat route 3060',location:'korat'},
        {id:2,title:'phuket route 506',location:'phuket'},
    ]
    await new Promise((resolve)=>setTimeout(resolve,1000))
    return camps
}