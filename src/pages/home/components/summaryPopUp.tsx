import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MarkdownRenderer from '../../../components/ui/MarkdownRenderer';

interface SummaryPopUpProps {
  summary: string;
  handleClose: () => void;
}

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

const SummaryPopUp: React.FC<SummaryPopUpProps> = ({ summary, handleClose }) => {
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
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <MarkdownRenderer
            content={summary}
            className="text-[16px] text-justify pb-1 leading-8 break-normal"
          />
        </Typography>
      </Box>
    </Modal>
  );
};

export default SummaryPopUp;
