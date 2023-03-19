
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie';
import { SERVER_URL } from '../constants.js'
class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email:'' };
  }


  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }


  emailHandleChange = (event) => {
    this.setState({ email: event.target.value });
  }


  // Add course
  addUser = (course) => {
    const token = Cookies.get('XSRF-TOKEN');
    console.log('course', course)
    fetch(`/student`,
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
      name, email
    }
    this.addUser(data);
  }


  render(){
    return (
      <div>
        <TextField fullWidth label="name" name="name" onChange={this.handleChange} />
        <TextField fullWidth label="email" name="email" onChange={this.emailHandleChange} style={{ marginTop: 50 }} />

        <Button onClick={this.handleAdd}>提交</Button>
      </div>
    )
  }
}


export default UserPage;