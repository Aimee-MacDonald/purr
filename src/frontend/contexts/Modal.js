import React, { createContext, useState } from 'react'

export default ({ children }) => {
  const [ isOpen, setOpen ] = useState(false)
  const [ isNotification, setIsNotification ] = useState(false)
  const [ notificationText, setNotificationText ] = useState('')

  const setNotification = notification => {
    setOpen(false)
    setNotificationText(notification)
    setIsNotification(true)
    setTimeout(() => setIsNotification(false), 2000)
  }

  const modal = {
    isOpen, setOpen,
    isNotification, notificationText, setNotification
  }

  return (
    <ModalContext.Provider value={modal}>
      {children}
    </ModalContext.Provider>
  )
}

const ModalContext = createContext(null)
export { ModalContext }