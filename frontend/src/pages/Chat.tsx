
import { useState } from "react"
import ChatComponent from "../components/ChatComponent"
import Header from "../components/Header"
import UserChats from "../components/UserChats"


const Chat = () => {

  const [fetchAgain,setFetchAgain]=useState(false)


  return (
    <>
      <Header />

      <div className="grid grid-cols-2 bg-primary min-h-[90vh] px-2">
        <UserChats fetchAgain={fetchAgain}/>
        <ChatComponent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>

    </>
  )
}

export default Chat
