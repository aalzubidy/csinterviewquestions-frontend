import { useContext, useState } from 'react';
import { Tooltip } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../Contexts/AuthContext';
import DeleteComment from '../DeleteComment';
import './commentCard.scss';

const CommentCard = (props) => {
  const { user } = useContext(AuthContext);
  const { id, username, create_date, body, solution } = props.comment;
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);

  const createDate = new Date(create_date).toISOString().substring(0, 10);

  return (
    <div className='row commentCardRow'>
      <DeleteComment commentId={id} displayDeleteDialog={displayDeleteDialog} setDisplayDeleteDialog={setDisplayDeleteDialog} />

      <div className='col-sm-2 text-center'>
        <Tooltip title='Username'><div>{username}</div></Tooltip>
        <Tooltip title='Comment create date'><div>{createDate}</div></Tooltip>
        {solution ? <Tooltip title='This comment contains a solution'><div><LightbulbIcon color='success' /></div></Tooltip> : ''}
        {user && user.username === username ? <Tooltip title='Delete comment'><div><DeleteIcon color='error' onClick={() => setDisplayDeleteDialog(true)} /></div></Tooltip> : ''}
      </div>

      <div className='col'>
        <div>{body}</div>
      </div>
    </div>
  )
}

export default CommentCard;
