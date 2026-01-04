

import { useEffect } from "react"
import Router from "./Router/Router"
import useUser from "./store/userStore"
import { useNavigate } from "react-router"
import useSocket from "./store/socketStore"

function App() {

  const { user, isLoggedIn } = useUser();
  const { initializeSocket, disconnectSocket } = useSocket()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn)
      navigate('/auth')
    else {
      initializeSocket(user)
    }

    return () => {
      if (isLoggedIn)
        disconnectSocket();
    }
  }, [isLoggedIn])



  return (
    <>

      <Router />


    </>
  )
}

export default App
