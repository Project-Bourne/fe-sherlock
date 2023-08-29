import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#4582C4',
  border: '2px solid #000',
  color: 'white',
  boxShadow: 24,
  p: 4,
};

const SummaryPopUp = ({ summary, handleClose, image }) => {
  return (
    <Modal
      open={!!summary} // Open modal if summary is provided
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Summary
        </Typography>
        <img src={image} className='w-full h-[100px] rounded-full' style={{objectFit: "contain"}} />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {summary}
        </Typography>
      </Box>
    </Modal>
  );
};

export default SummaryPopUp;
