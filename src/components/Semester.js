import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../constants.js'
import {SEMESTER_LIST} from '../constants.js'

// user selects from a list of  (year, semester) values
class Semester extends Component {
    constructor(props) {
      super(props);
      this.state = { selected: SEMESTER_LIST.length - 1, open: false };
      
    }
 
   onRadioClick = (event) => {
    console.log("Semester.onRadioClick "+JSON.stringify(event.target.value));
    this.setState({selected: event.target.value});
  }


  // Add course
  addUser = (course) => {
    const token = Cookies.get('XSRF-TOKEN');
    console.log('course', course)
    fetch(`/schedule`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': token
        },
        body: JSON.stringify(course)
      })
      .then(res => {
        if (res.ok) {
          toast.success("Course successfully added", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchCourses();
        } else {
          toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }
      })
      .catch(err => {
        toast.error("Error when adding", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
      })
  } 


  handleAdd = () => {
    const { name, email } = this.state
    let data = {
      name,email
    }
    this.addUser(data);
    this.handleClose();
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }


  emailHandleChange = (event) => {
    this.setState({ email: event.target.value  });
  }


  showModal = ()=>{
    this.setState({ open: true})
  }

  
  render() {    
      const icolumns = [
      {
        field: 'id',
        headerName: 'Year',
        width: 200,
        renderCell: (params) => (
          <div>
            <Radio
              checked={params.row.id == this.state.selected}
              onChange={this.onRadioClick}
              value={params.row.id}
              color="default"
              size="small"
            />
            { SEMESTER_LIST[params.row.id].year }
          </div>
        )
      },
      { field: 'name', headerName: 'Semester', width: 200 }
      ];       
       
    return (
       <div>
         <AppBar position="static" color="default">
            <Toolbar>
               <Typography variant="h6" color="inherit">
                  Schedule - select a term
               </Typography>
            </Toolbar>
         </AppBar>
         <div align="left" >
              <div style={{ height: 400, width: '100%', align:"left"   }}>
                <DataGrid   rows={SEMESTER_LIST} columns={icolumns} />
              </div>                
              <Button component={Link} 
                      to={{pathname:'/schedule' , 
                      year:SEMESTER_LIST[this.state.selected].year, 
                      semester:SEMESTER_LIST[this.state.selected].name}} 
                variant="outlined" color="primary" style={{margin: 10}}>
                Get Schedule
              </Button>
              <Button
                component={Link} 
                to={{
                  pathname: '/user',
                }} 
                variant="outlined" color="primary" style={{ margin: 10 }}>
                Add
              </Button>
          {/* <Dialog
            open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>Add Course</DialogTitle>
            <DialogContent style={{ paddingTop: 20 }} >
              <TextField fullWidth label="name" name="name" onChange={this.handleChange} />
              <TextField fullWidth label="email" name="email" onChange={this.emailHandleChange} style={{ marginTop: 50 }} />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
              <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
            </DialogActions>
          </Dialog>     */}
          </div>
      </div>
    )
  }
}
export default Semester;