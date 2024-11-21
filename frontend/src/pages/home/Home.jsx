import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  return (
    <>
      <Navbar />
      <div className="container ml-7">
        <div className="grid grid-cols-4 gap-4 mt-8">
          <NoteCard
            title="Meeting With Rahul"
            date="12-12-2023"
            content="Meeting at Shangrilla Hotel in 3rd October"
            tags="Meeting"
            isPined={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModal({
            isShown: true,
            type: 'add',
            data: null,
          })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
      
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },  
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden " // Add a custom class for styling if needed
      >
        <AddEditNotes
        type={openAddEditModal.type}
        noteData = {openAddEditModal.data}
        onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}/>
      </Modal>
    </>
  );
};

export default Home;
