import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UploadPuzzle from 'upload-puzzle'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chunks: [],
      NumberOfChunks: 0
    }
  }

  updateNOC = NumberOfChunks => {
    this.setState({NumberOfChunks})
  }

  updateChunks = chunks => {
    this.setState({chunks})
  }

  uploadWith_UPLOAD_PUZZLE = File => {
    const Upload = new UploadPuzzle({
      setupURL: 'http:////10.0.0.252:5001/upload/setup',
      uploadChunkURL: 'http:////10.0.0.252:5001/upload',
      concurrence: 4
    })

    // handle chunk upload changes
    Upload.onChange(response => {
      this.updateChunks(response.buffers)
      console.log('onChange', response.buffers)
    })
    // after all chunks has been uploadded
    Upload.onComplete(response => {
      this.updateChunks(response.buffers)
      console.log('onComplete', response.buffers)
    })
    // on errors
    Upload.onError(error => {
      this.updateChunks(error.buffers)
      console.log('onError', error)
    })

    //setting file
    Upload.setFile(File)

    // start uploading
    Upload.upload()
  }

  uploadNormalFile = File => {
    const formData = new FormData()
    formData.append('file', File)

    const myInit = {
      method: 'POST',
      body: formData,
    }

    const myRequest = new Request('http:////10.0.0.252:5001/file-upload', myInit)
    fetch(myRequest)
    .then(res => { return res.json() })
    .then(response => {
      debugger
    })
    .catch(error => {
      debugger
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>


          {/* /////////////////////////////////// */}
          <p>{`Number of chunks (${this.state.NumberOfChunks})`}</p>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {
              this.state.chunks.map((chunk, key) => {
                return (<span key={key} style={{backgroundColor: chunk.done ? 'green' : chunk.uploading ? 'blue' : 'silver', padding: '3px' }}>{`${chunk.index}`}</span>)
              })
            }
          </div>

          {/* /////////////////////////////////// */}

            <input type="file" onChange={ e => {
              const File = e.target.files[0]

              fetch(new Request(`http:////10.0.0.252:5001/upload/check/${File.size}`,
                { method: 'GET' }
              ))
              .then(res => {
                return res.json();
              })
              .then(response => {
                this.updateNOC(response.numberOfChunks)
                // this.uploadNormalFile(File)
                this.uploadWith_UPLOAD_PUZZLE(File)
              })
            }} />




        </header>
      </div>
    );
  }
}

export default App;
