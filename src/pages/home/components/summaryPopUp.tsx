import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MarkdownRenderer from '../../../components/ui/MarkdownRenderer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface SummaryPopUpProps {
  summary: string;
  handleClose: () => void;
}

const SummaryPopUp: React.FC<SummaryPopUpProps> = ({ summary, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: '90%',
      sm: '70%',
      md: '50%',
      lg: '40%'
    },
    maxHeight: {
      xs: '80vh',
      sm: '70vh',
      md: '60vh'
    },
    bgcolor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '&:focus': {
      outline: 'none'
    }
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E0E0E0',
    pb: 2,
    px: {
      xs: 2,
      sm: 3,
      md: 4
    },
    pt: {
      xs: 2,
      sm: 3,
      md: 4
    },
    bgcolor: '#FFFFFF',
    zIndex: 10,
    flexShrink: 0
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    px: {
      xs: 2,
      sm: 3,
      md: 4
    },
    py: 2,
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#4582C4',
      borderRadius: '4px',
      '&:hover': {
        background: '#3571B3'
      }
    }
  };

  return (
    <Modal
      open={!!summary}
      onClose={handleClose}
      aria-labelledby="summary-modal-title"
      aria-describedby="summary-modal-description"
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 500,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }
        }
      }}
    >
      <Box sx={style}>
        <Box sx={headerStyle}>
          <Typography 
            id="summary-modal-title" 
            variant={isMobile ? "h6" : "h5"} 
            component="h2"
            sx={{
              fontWeight: 600,
              color: '#4582C4'
            }}
          >
            Summary Details
          </Typography>
          <IconButton
            onClick={handleClose}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: '#666666',
              '&:hover': {
                bgcolor: 'rgba(69, 130, 196, 0.1)',
                color: '#4582C4'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box 
          id="summary-modal-description"
          sx={contentStyle}
        >
          <MarkdownRenderer
            content={summary}
            className={`text-[${isMobile ? '14px' : '16px'}] text-justify pb-1 leading-8 break-normal text-gray-700`}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default SummaryPopUp;
