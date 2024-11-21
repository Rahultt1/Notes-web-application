import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';

const AddEditNotes = ({ noteData, type, onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [errors, setErrors] = useState([]);

    const addNewNote = async() => {}
    const editNote = async() => {}

    const handleAddNewNote = () => {
        if (!title) {
            setErrors(["Title is required"]);
            return;
        }

        if (!content) {
            setErrors(["Content is required"]);
            return;
        }

        setErrors([]);

        if(type == 'edit') {
          editNote()
        }else{
          addNewNote();
        }
    };

    return (
        <div className='relative'>
            <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 absolute -right-3 -top-3"
                onClick={onClose}
            >
                <MdClose className='text-xl text-slate-400' />
            </button>

            <div className="flex flex-col gap-2">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go to Gym At 5 Am"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label className="input-label">Content</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>
            <div className='mt-3'>
                <label className='input-label'>Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            {errors.length > 0 && <p className='text-xs pt-4 text-red-600'>{errors[0]}</p>}
            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNewNote}>Add</button>
        </div>
    );
};

export default AddEditNotes;
