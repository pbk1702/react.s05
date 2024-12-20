import React from 'react'
import './ModalBox.css'

const ModalBox = ({setCurrentModal, children}) => {
  const closeModal = () => setCurrentModal('None')
  return (
    <>
      <div className='ModalBg' onClick={ () => closeModal() }></div>
      <div className='ModalBox'>        
        { React.Children.map(children, (child) => React.cloneElement(child, { closeModal }))}
      </div>
    </>
  )
}

export default ModalBox


