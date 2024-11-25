import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance'; // Ensure axiosInstance is imported
import moment from 'moment';
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // Fix destructuring of useState
  const navigate = useNavigate();

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Corrected state setter
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

 
  //Get All notes 
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes); // Corrected state setter
      }
    } catch (error) {
      console.log("Unexpected Error Occurred");
    }
  }; // Removed the extra closing bracket here
  


  useEffect(() => {
    getUserInfo();
    getAllNotes(); // Call the function to fetch all notes
  }, []); 
  

  return (
    <>
      {/* Pass userInfo as a prop to Navbar */}
      <Navbar userInfo={userInfo} />
      <div className="container ml-7">
        <div className="grid grid-cols-4 gap-4 mt-8">
          {allNotes.map((item,index) => (
            <NoteCard
            key={item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPined={item.isPined}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
            
         ))}
          
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
        onRequestClose={() =>
          setOpenAddEditModal({
            isShown: false,
            type: 'add',
            data: null,
          })
        }
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: 'add', data: null })
          }
        />
      </Modal>
    </>
  );
};

export default Home;
