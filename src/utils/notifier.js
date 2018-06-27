import React     from "react"
import { toast } from 'react-toastify';
if(Meteor.isClient){
    require('react-toastify/dist/ReactToastify.css');
}

const notifierInit = (config) => {

    // Extract datas from config
    const { toastPosition = "bottom left" } = config
    
    const position = toastPosition.toUpperCase().replace(' ', '_')
    
    global.notify = {
        success: (message) => toast.success(message, {
            position: toast.POSITION[position]
        }),
        error: (message) => toast.error(message, {
            position: toast.POSITION[position]
        }),
        warn: (message) => toast.warn(message, {
            position: toast.POSITION[position]
        }),
        info: (message) => toast.info(message, {
            position: toast.POSITION[position]
        })
    }
}

export default notifierInit
