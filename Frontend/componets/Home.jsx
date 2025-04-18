import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CssBaseline,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { field_name } from '../helper/constant';

export default function HomePage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    vertical: 'top',
    horizontal: 'center'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    index: null
  });

  const token = localStorage.getItem('token');

  const url='http://localhost:5000/api/'

  const fetchNotes = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (!userId || !token) {
        navigate("/login")
        return;
      }

      const response = await axios.post(
        `${url}notes/getNote`,
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );
      console.log('Notes fetched successfully:', response.data);
      setNotes(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error fetching notes:', error.response.data.message);
      } else {
        console.error('Error while making the API request:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [refresh]);

  const showSnackbar = (message) => {
    setSnack({
      open: true,
      message,
      vertical: 'top',
      horizontal: 'center'
    });
  };

  const handleCloseSnackbar = () => {
    setSnack((prev) => ({ ...prev, open: false }));
  };
  const removeUserData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };
  
  const handleLogout = async () => {
    try {
      await axios.post(`${url}user/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      removeUserData();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      removeUserData();
      navigate('/login');
    }
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    if (name === field_name.description && value.length > 200) return;

    setNewNote((prev) => ({ ...prev, [name]: value }));
    setErrors({});
  };

  const saveNote = async () => {
    if (newNote.title.trim() === '' || newNote.description.trim() === '') {
      setErrors({ newNote: 'Title and description are required!' });
      return;
    }

    const noteData = {
      id: newNote._id,
      title: newNote.title,
      description: newNote.description,
    };

    const url = editIndex !== null
      ? 'http://localhost:5000/api/notes/update'
      : 'http://localhost:5000/api/notes/createNote';

    try {
      const response = await axios.post(
        url,
        noteData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (!response.data.success && !response.data._id) {
        throw new Error('Failed to save the note');
      }

      setRefresh(prev => !prev);
      setNewNote({ title: '', description: '' });
      setEditIndex(null);
      setIsModalOpen(false);
      setErrors({});
      showSnackbar(editIndex !== null ? 'Note updated successfully!' : 'Note added successfully!');
    } catch (error) {
      showSnackbar(`Error: ${error.message}`);
    }
  };


  const requestDeleteNote = async (index, note) => {
    try {
      const response = await axios.post(
        `${url}notes/delete`,
        { id: note._id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      console.log('Delete success:', response.data.message);
      setDeleteDialog({ open: true, index });
    } catch (error) {
      if (error.response) {
        console.error('Delete failed:', error.response.data.error);
      } else {
        console.error('Error deleting note:', error.message);
      }
    }
  };

  const confirmDeleteNote = () => {
    const updatedNotes = notes.filter((_, i) => i !== deleteDialog.index);
    setNotes(updatedNotes);
    setDeleteDialog({ open: false, index: null });
    showSnackbar('Note deleted successfully');
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, index: null });
  };

  const editNote = (index) => {
    setNewNote(notes[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <main>
      <CssBaseline />
      <Box sx={{ padding: 4, backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
        {/* Top Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'left',
            mb: 4,
            backgroundColor: '#fff',
            borderRadius: 2,
            padding: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            My Notes
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: '#ff1744',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#f01440'
              }
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Add Note Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          sx={{ mb: 3 }}
        >
          Add Note
        </Button>

        {/* Add/Edit Note Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editIndex !== null ? 'Edit Note' : 'Add Note'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={newNote.title}
              onChange={handleNoteChange}
              fullWidth
              margin="dense"
              error={!!errors.newNote && newNote.title.trim() === ''}
            />
            <TextField
              label="Description"
              name="description"
              value={newNote.description}
              onChange={handleNoteChange}
              fullWidth
              multiline
              rows={4}
              margin="dense"
              placeholder="Write your note here..."
              variant="outlined"
              error={!!errors.newNote && newNote.description.trim() === ''}
              helperText={`${newNote.description.length}/200${errors.newNote ? ` - ${errors.newNote}` : ''
                }`}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setEditIndex(null);
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={saveNote} color="primary">
              {editIndex !== null ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={cancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this note?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="primary">
              No
            </Button>
            <Button onClick={confirmDeleteNote} color="error">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Search Input */}
        <TextField
          label="Search notes"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 4 }}
        />

        {/* Notes List */}
        {/* Notes List */}
        <Grid container spacing={3} alignItems="stretch" justifyContent="flex-start">
          {notes
            .filter(note =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((note, index) => (
              <Grid item key={index}>
                <Card
                  sx={{
                    minWidth: 300,
                    maxWidth: 300,
                    minHeight: 200,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 2,
                    borderRadius: 2,
                    backgroundColor: '#fff'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {note.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: 'break-word', color: '#333', mt: 1 }}
                    >
                      {note.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button variant="outlined" size="small" onClick={() => editNote(index)}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => requestDeleteNote(index, note)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Snackbar Notification */}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snack.open}
          onClose={handleCloseSnackbar}
          message={snack.message}
          autoHideDuration={2000}
          key="bottomleft"
        />
      </Box>
    </main>
  );
}
