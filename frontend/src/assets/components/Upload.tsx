import Button from '@mui/material/Button';
import axios from 'axios';
import { useState } from 'react';
export const Upload = () => {

  const [aiResponse, setAiResponse] = useState<string | null>(null);

    const handleSubmit = async (e: any): Promise<void>  => {
        e.preventDefault();
        
        const file = e.target[0].files[0]
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axios.post("http://localhost:3000/api/upload-file", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('Response:', response.data);
            setAiResponse(response.data.response);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

  return (
    <div className='w-1/3 mx-auto h-screen flex justify-center items-center '>
      <form className='text-center shadow-lg p-6' onSubmit={handleSubmit}>
        <div className="grid w-full max-w-xs items-center gap-1.5 py-2">
          <input
            id="picture"
            type="file"
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
          />
        </div>
        <Button variant="contained" type='submit'>Submit</Button>
      </form>
      {aiResponse && <div>{aiResponse}</div>}
    </div>
  );
}
