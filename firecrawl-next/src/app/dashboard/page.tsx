"use client"

import { supabase } from "@/supabase/supabase-js-client"

export default function Dashboard() {

async function getHistory() {
    const { data, error } = await supabase.from('rawHistoryItems').select('*')
    
    console.log(data)
    console.log(error)
    return data
}

    return (
      <div>
        <h1>Dashboard</h1>
        <button onClick={getHistory}>Get History</button> 
      </div>
    )
}