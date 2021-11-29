import React, { useContext, useEffect } from 'react'

import './ModalLayer.sass'

import { ModalContext } from '../../contexts/Modal'

const ModalLayer = () => {
  const { isOpen, notificationText, isNotification} = useContext(ModalContext)

  return (
    <div id='ModalLayer' className={`modal${isOpen ? 'Open' : isNotification ? 'Notification' : 'Closed'}`}>
      <p>{notificationText}</p>
    </div>
  )
}

export default ModalLayer