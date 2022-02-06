import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@mui/material';
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AlertsContext } from '../../Contexts/AlertsContext';
import { AuthContext } from '../../Contexts/AuthContext';
import API from '../../API';
import './deleteComment.scss';

const DeleteComment = (props) => {
  // Dialog display settings
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Settings
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'Comment delete dialog - Uknown error, check console logs for details';
  const { token } = useContext(AuthContext);

  // Specific
  const { commentId, displayDeleteDialog, setDisplayDeleteDialog } = props;

  const handleDeleteComment = async () => {
    setDisplayDeleteDialog(false);
    try {
      const { data } = await API.comments.deleteById(commentId, token);
      if (data) alertMsg('success', 'deleted comment successfully');
    } catch (error) {
      alertMsg('error', 'could not delete comment', error.message || genericError, error);
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={displayDeleteDialog}
      onClose={() => setDisplayDeleteDialog(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Delete Comment: {commentId}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this comment? We can't recover it once its deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setDisplayDeleteDialog(false)}>
          No
        </Button>
        <Button color='error' onClick={handleDeleteComment} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteComment;
