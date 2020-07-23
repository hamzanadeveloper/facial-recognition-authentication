import React, { Component } from 'react'
import * as faceapi from 'face-api.js'
import './signup.css'

import Paper from '@material-ui/core/Paper'
import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import CameraIcon from '@material-ui/icons/Camera'
import Tooltip from '@material-ui/core/Tooltip'

const { host, protocol } = window.location
const PATH = `${protocol}//${host}/models/`

const themeInstance = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '0 30px',
  },
}))

function DeepChild() {
  const classes = useStyles();

  return (
    <Button type="submit" className={classes.root}>
      Sign In
    </Button>
  )
}

export default class Signup extends Component {
  constructor(props){
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      error: false,
      snackBarOpen: false,
      snackBarMessage: '',

      showPassword: false,
      showVideo: false,

      model: null,
      imageURI: ''
    }
  }

  componentDidMount() {
    return this.loadModels()
  }

  loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
    console.log("Model Loaded")
    this.initVideo()
  }

  initVideo = () => {
    const video = document.getElementById('video')

    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      error => console.error(error)
    )

    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video)
      const videoContainer = document.getElementById('video-container')
      videoContainer.append(canvas)

      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
      }, 100)
    })
  }

  handleChange = (field, value) => this.setState({ [field]: value })

  handleCreate = () => {
    const { imageURI } = this.state

    if(imageURI === ''){
      this.setState({ error: true, snackBarOpen: true, snackBarMessage: "Registration requires a picture."})
      return
    }

  }

  handleTakePhoto = async () => {
    const video = document.getElementById('video')
    video.pause()

    const canvas = document.querySelector("canvas")
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataURL = canvas.toDataURL()

    this.setState({ imageURI: dataURL, snackBarOpen: true, snackBarMessage: 'Photo has been captured!', showVideo: false, error: false })
  }

  render () {
    const { first_name, last_name, email, password, showPassword, showVideo, snackBarOpen, snackBarMessage, error } = this.state

    return (
      <Paper
        elevation={3}
        square
        style={{
          width: '90%',
          height: '75%'
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                padding: 20,
                fontSize: 32,
                textTransform: 'uppercase'
              }}
            >Sign In</div>
            <div>
              <AccountCircleIcon style={{ fontSize: 84 }} />
            </div>
            <form
              onSubmit={(event) => { event.preventDefault(); this.handleCreate()}}
              style={{ width: '60%' }}
            >
              <TextField
                fullWidth
                id="first_name"
                label="First Name"
                margin="dense"
                onChange={(event) => this.handleChange('first_name', event.target.value)}
                variant="outlined"
                style={ {marginTop: 20 }}
                InputLabelProps={{ required: false }}
                value={first_name}
              />
              <TextField
                fullWidth
                id="last_name"
                label="Last Name"
                margin="dense"
                required
                onChange={(event) => this.handleChange('last_name', event.target.value)}
                variant="outlined"
                InputLabelProps={{ required: false }}
                value={last_name}
              />
              <div style={{ textAlign: 'center' }}>
                <Tooltip title="Take a Picture">
                  <CameraIcon
                    onClick={() => this.setState({ showVideo: !showVideo })}
                    style={{
                      fontSize: 48,
                      marginTop: 10,
                      color: error ? '#f75500' : 'inherit',
                      cursor: 'pointer',
                      border: '1px solid black',
                      borderRadius: 28,
                    }}/>
                </Tooltip>
              </div>
              <TextField
                fullWidth
                id="email"
                label="Email"
                margin="dense"
                onChange={(event) => this.handleChange('email', event.target.value.trim().toLowerCase())}
                required
                variant="outlined"
                type="email"
                value={email}
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                margin="dense"
                onChange={(event) => this.handleChange('password', event.target.value)}
                required
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => this.setState({ showPassword: !showPassword })}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 20 }}>
                <ThemeProvider theme={themeInstance}>
                  <DeepChild />
                </ThemeProvider>

                <Button
                  variant="outlined"
                  style={{ paddingRight: '30px', paddingLeft: '30px' }}
                >Login</Button>
              </div>
              <div
               style={{
                fontSize: '15px',
                textAlign: 'center',
                fontWeight: 100,
                fontFamily: 'Roboto, sans-serif',
                marginTop: '24px'
              }}>
                By signing up, you agree to Hamza's made up <a href="/signup" style={{ textDecoration: 'none', color: '#42a5f5'}}>Terms and Conditions</a> & <a href="/signup" style={{ textDecoration: 'none', color: '#42a5f5'}}>Privacy Policy</a>
              </div>
            </form>
          </div>
          <div style={{ width: '50%', height: '100%', backgroundImage: 'url("/images/bg-01.jpg")' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', visibility: showVideo ? 'inherit' : 'hidden', height: '100%' }}>
              <div id="video-container" style={{ position: 'relative' }}>
                <video
                  id="video"
                  width="480"
                  height="373"
                  autoPlay
                  muted
                />
              </div>
              <Button
                color="primary"
                variant="contained"
                onClick={() => this.handleTakePhoto()}
              >
                Capture
              </Button>
            </div>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={() => this.setState({ snackBarOpen: false })}
          message={snackBarMessage}
        />
      </Paper>
    )
  }
}
