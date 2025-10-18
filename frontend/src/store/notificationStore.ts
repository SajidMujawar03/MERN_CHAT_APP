import { create } from "zustand";
import {type  Message } from "../components/miscelleneous/SingleChat";




type NotificationStore = {
    notification:Message[],
    setNotification:(notification:Message)=>void;
    removeNotification:(notification:Message)=>void
}



const useNotification = create<NotificationStore>()((set,get) => (
    {
        notification:[],
        setNotification:(newNotification:Message)=>{
            const notification=get().notification
            console.log("hbhrfbhbh")
            set({notification:[...notification,newNotification]})
        },
        removeNotification:(n:Message)=>{
            const notification=get().notification
            set({notification:notification.filter(nt=>nt.chat._id!=n.chat._id)})
        }
    }
))



export default useNotification;