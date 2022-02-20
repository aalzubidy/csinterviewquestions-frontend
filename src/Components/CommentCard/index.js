import { useContext, useState } from 'react';
import { Tooltip } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../../Contexts/AuthContext';
import DeleteComment from '../DeleteComment';
import EditComment from '../EditComment';
import './commentCard.scss';

const CommentCard = (props) => {
  const { user } = useContext(AuthContext);
  const { id, username, create_date, body, solution } = props.comment;
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);

  const createDate = new Date(create_date).toISOString().substring(0, 10);

  return (
    <div className='row commentCardRow'>
      <DeleteComment commentId={id} displayDeleteDialog={displayDeleteDialog} setDisplayDeleteDialog={setDisplayDeleteDialog} />

      <EditComment commentId={id} commentBody={body} commentSolution={solution} displayEditDialog={displayEditDialog} setDisplayEditDialog={setDisplayEditDialog} />

      <div className='col-sm-2 text-center'>
        <Tooltip title='Username'><div>{username}</div></Tooltip>
        <Tooltip title='Comment create date'><div>{createDate}</div></Tooltip>
        {solution ? <Tooltip title='This comment contains a solution'><div><LightbulbIcon color='success' /></div></Tooltip> : ''}
        {user && user.username === username ? <div>
          <Tooltip title='Delete comment'><DeleteIcon color='error' onClick={() => setDisplayDeleteDialog(true)} /></Tooltip>
          <Tooltip title='Edit comment'><EditIcon color='info' onClick={() => setDisplayEditDialog(true)} /></Tooltip>
        </div> : ''}
      </div>

      <div className='col'>
        <div>{body}</div>
      </div>
    </div>
  )
}

export default CommentCard;
