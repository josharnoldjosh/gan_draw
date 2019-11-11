/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import axios from 'axios';
import {Tools, SketchField} from './index.js';
import ReactDOM from 'react-dom';
import {
  FormControl,
  Button,
  ButtonGroup,
  InputGroup,
  FormGroup,
  MenuItem,
  DropdownButton,
  Badge,
  Popover,
  Overlay,
  Nav,
  NavItem,
  Col,
  ControlLabel,
  Form,
} from 'react-bootstrap';
import $ from 'jquery';

class CustomTextResponse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textval: '', sending: false };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Only change in the active status of this component should cause a
    // focus event. Not having this would make the focus occur on every
    // state update (including things like volume changes)
    if (this.props.active && !prevProps.active) {
      $('input#id_text_input').focus();
    }
    this.props.onInputResize();
  }

  tryMessageSend() {

    let data = new FormData();
    data.append('utt', this.state.textval);

    axios.post("https://language.cs.ucdavis.edu/english", data).then((response) => {      
        // Show the image to the user      
        var result = response['data'];

        if (result['can_send'] == true) {
            this.props.triggerSaveImage();
    

            if (this.state.textval.length > 140) {
                alert("Your answer is too long! Please type an answer that is less than 140 characters.");
            }else if (this.state.textval != '' && this.props.active && !this.state.sending) {

                // try to call function


              this.setState({ sending: true });
              this.props.onMessageSend(this.state.textval, {}, () =>
                this.setState({ textval: '', sending: false })
              );
            }
        }else{
            alert(result['info'])
        }
    }); 
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.tryMessageSend();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }

  render() {
    // TODO maybe move to CSS?
    let pane_style = {
      paddingLeft: '25px',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingRight: '25px',
      float: 'left',
      width: '100%',
    };
    let input_style = {
      height: '50px',
      width: '100%',
      display: 'block',
      float: 'left',
    };
    let submit_style = {
      width: '100px',
      height: '100%',
      fontSize: '16px',
      float: 'left',
      marginLeft: '10px',
      padding: '0px',
    };

    let text_input = (
      <FormControl
        type="text"
        id="id_text_input"
        style={{
          width: '80%',
          height: '100%',
          float: 'left',
          fontSize: '16px',
        }}
        value={this.state.textval}
        placeholder="Please enter here..."
        onKeyPress={e => this.handleKeyPress(e)}
        onChange={e => this.setState({ textval: e.target.value })}
        disabled={!this.props.active || this.state.sending}
      />
    );

    let submit_button = (
      <Button
        className="btn btn-primary"
        style={submit_style}
        id="id_send_msg_button"
        disabled={
          this.state.textval == '' || !this.props.active || this.state.sending
        }
        onClick={() => this.tryMessageSend()}
      >
        Send
      </Button>
    );

    return (
      <div
        id="response-type-text-input"
        className="response-type-module"
        style={pane_style}
      >
        <div style={input_style}>
          {text_input}
          {submit_button}
        </div>
      </div>
    );
  }
}

class CustomTextResponseTeller extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textval: '', sending: false };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Only change in the active status of this component should cause a
    // focus event. Not having this would make the focus occur on every
    // state update (including things like volume changes)
    if (this.props.active && !prevProps.active) {
      $('input#id_text_input').focus();
    }
    this.props.onInputResize();
  }

  tryMessageSend() {

    let data = new FormData();
    data.append('utt', this.state.textval);

    axios.post("https://language.cs.ucdavis.edu/english", data).then((response) => {      
        // Show the image to the user      
        var result = response['data'];

        if (result['can_send'] == true) {
            
            if (this.state.textval.length > 140) {
                alert("Your answer is too long! Please type an answer that is less than 140 characters.");
            }else if (this.state.textval != '' && this.props.active && !this.state.sending) {
              this.setState({ sending: true });
              this.props.onMessageSend(this.state.textval, {}, () =>
                this.setState({ textval: '', sending: false })
              );
            }
        }else{
            alert(result['info'])
        }
    }); 
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.tryMessageSend();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }

  render() {
    // TODO maybe move to CSS?
    let pane_style = {
      paddingLeft: '25px',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingRight: '25px',
      float: 'left',
      width: '100%',
    };
    let input_style = {
      height: '50px',
      width: '100%',
      display: 'block',
      float: 'left',
    };
    let submit_style = {
      width: '100px',
      height: '100%',
      fontSize: '16px',
      float: 'left',
      marginLeft: '10px',
      padding: '0px',
    };

    let text_input = (
      <FormControl
        type="text"
        id="id_text_input"
        style={{
          width: '80%',
          height: '100%',
          float: 'left',
          fontSize: '16px',
        }}
        value={this.state.textval}
        placeholder="Please enter here..."
        onKeyPress={e => this.handleKeyPress(e)}
        onChange={e => this.setState({ textval: e.target.value })}
        disabled={!this.props.active || this.state.sending}
      />
    );

    let submit_button = (
      <Button
        className="btn btn-primary"
        style={submit_style}
        id="id_send_msg_button"
        disabled={
          this.state.textval == '' || !this.props.active || this.state.sending
        }
        onClick={() => this.tryMessageSend()}
      >
        Send
      </Button>
    );

    return (
      <div
        id="response-type-text-input"
        className="response-type-module"
        style={pane_style}
      >
        <div style={input_style}>
          {text_input}
          {submit_button}
        </div>
      </div>
    );
  }
}

class Title extends React.Component {
    render() {
        return (
            <h1 style={{color:'black', textAlgin:'center', fontFamily:'HelveticaNeue-Light', fontSize:'20px', fontWeight: '200'}}>
                {this.props.text}
            </h1>
        );
    }
}

class Subtitle extends React.Component {
    render() {
        return (
            <p style={{color:'#4a4a4a', textAlgin:'center', fontFamily:'HelveticaNeue-Light', fontSize:'13px', fontWeight: '300', margin:"10px"}}>
                {this.props.text}
            </p>
        );
    }
}

class Toolbar extends React.Component {

  state = {selectedButton:0, selectedSize:2}

  render() {
    return (
      <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', margin:'5px', alignItems:'flex-start', marginTop:'10px', backgroundColor:"#f9f9f9"}}>

        <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', margin:'10px', padding:'10px', width:'120px', marginTop:'0px'}}>
            <Subtitle text={"Tools: "} />            
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedButton == 0 ? '5px' : '0px'}} onClick={() => {this.props.updateTool(Tools.Pencil); this.setState({selectedButton:0})}}>Pencil</button>            
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedButton == 1 ? '5px' : '0px'}} onClick={() => {this.props.updateTool(Tools.Line); this.setState({selectedButton:1})}}>Line</button>
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedButton == 2 ? '5px' : '0px'}} onClick={() => {this.props.updateTool(Tools.Rectangle); this.setState({selectedButton:2})}}>Rectangle</button>
            <button style={{margin:'7px', backgroundColor:'white', borderWidth:'0px'}} onClick={() => this.props.undo()}>Undo</button>                
        </div>

        <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', margin:'10px', padding:'10px', width:'120px', marginTop:'0px'}}>
            <Subtitle text={"Brush size: "} />            
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedSize == 0 ? '5px' : '0px'}} onClick={() => {this.props.updateBrushSize(1); this.setState({selectedSize:0})}}>Small</button>
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedSize == 1 ? '5px' : '0px'}} onClick={() => {this.props.updateBrushSize(2); this.setState({selectedSize:1})}}>Medium</button>
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedSize == 2 ? '5px' : '0px'}} onClick={() => {this.props.updateBrushSize(3); this.setState({selectedSize:2})}}>Large</button>            
        </div>
      </div>
    );
  }
}

class Palate extends React.Component {

    state = {selectedButton:1}

    render() {
        return (
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Subtitle text={"Palate"} />            
            <div  style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'flex-start', marginBottom:'100px'}} >    

                <div style={{flexWrap:'wrap', display:'flex', justifyContent:'flex-start', alignItems:'center', width:'80px', margin:'0px'}}>                                
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#f2dae3', color:'black', borderColor: 'red', borderWidth: this.state.selectedButton == 5 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#f2dae3'); this.setState({selectedButton:5})}} >Clouds</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#6eb4e8', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 0 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#6eb4e8'); this.setState({selectedButton:0})}} >Sky</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#3c53a3', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 1 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#3c53a3'); this.setState({selectedButton:1})}} >Sea</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#807761', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 2 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#807761'); this.setState({selectedButton:2})}} >Mountain</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#71cc2b', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 21 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#71cc2b'); this.setState({selectedButton:21})}} >Grass</button>                                                         
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#87ab6f', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 11 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#87ab6f'); this.setState({selectedButton:11})}} >Tree</button>

                    <button style={{width:'100px', margin:'5px', backgroundColor:'#526bd9', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 19 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#526bd9'); this.setState({selectedButton:19})}} >Water</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#65a398', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 9 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#65a398'); this.setState({selectedButton:9})}} >River</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#e6be30', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 20 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#e6be30'); this.setState({selectedButton:20})}} >Flower</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#635f5d', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 3 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#635f5d'); this.setState({selectedButton:3})}} >Rock</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#469632', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 10 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#469632'); this.setState({selectedButton:10})}} >Bush</button>                    
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#ededed', color:'black', borderColor: 'red', borderWidth: this.state.selectedButton == 8 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#ededed'); this.setState({selectedButton:8})}} >Snow</button>

                    <button style={{width:'100px', margin:'5px', backgroundColor:'#d6c77c', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 6 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#d6c77c'); this.setState({selectedButton:6})}} >Sand</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#967e54', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 14 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#967e54'); this.setState({selectedButton:14})}} >Dirt</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#e8d423', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 22 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#e8d423'); this.setState({selectedButton:22})}} >Straw</button>
                </div>                  

            </div>
            </div>
        );
    }
}

class Canvas extends React.Component {

  state = {
    tool: Tools.Pencil,
    color:'#6eb4e8',
    brushSize:90,
    canUndo:false       
  };

  updateTool = (tool) => {
    this.setState({tool:tool});
  }

  render() {
    var flexStyle = {display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}

    return (  
      <div style={flexStyle}>
        <Title text={"Canvas"} />
        <Subtitle text={"This is where you draw your image."} />
        <SketchField
          name="sketch"
          ref={c => (this._sketch = c)}
          style={{backgroundColor:'#6eb4e8'}}
          width='300px' 
          height='300px'
          tool={this.state.tool}
          lineColor={this.props.color}
          fillColor={this.props.color}
          lineWidth={this.state.brushSize}
          onChange={this._onSketchChange}
        />
        <Toolbar updateBrushSize={this.changeBrushSize} undo={this.undo} redo={this.redo} updateTool={this.updateTool} />
      </div>
    );
  }

  changeBrushSize = (size) => {
    if (size == 1) {
        this.setState({brushSize:15});    
    }else if (size == 2) {
        this.setState({brushSize:30});    
    }else if (size == 3) {
        this.setState({brushSize:90});    
    }
  };

  _onSketchChange = () => {        
    let prev = this.state.canUndo;
    let now = this._sketch.canUndo();
    if (prev !== now) {
        this.setState({ canUndo: now });
    }
  };

  undo = () => {  
    if (this.state.canUndo == true) {            
        this._sketch.undo();            
    }else{
        this._sketch.clear();
    }

    this.setState({
        canUndo: this._sketch.canUndo()        
    }); 
  }  
}

class Preview extends React.Component {
    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginLeft:'5px'}}>
                <Title text={"Preview"} />
                <Subtitle text={"This is where you see your final image."} />
                <p>{this.props.loading}</p>
                <img src={this.props.image} style={{width:'300px', height:'300px', backgroundColor:'#f9f9f9', marginBottom:'20px'}} />                
                <button style={{width:'100px', marginBottom:'200px'}} onClick={() => this.props.convertImage()} disabled={this.props.disableConvert}>Convert</button>
            </div>
        );
    }
}

class DrawerUI extends React.Component {

    state = {color:'#3c53a3', image:undefined, loading:"", disableConvert:false}

    changeColor = (color) => {
        this.setState({color:color})
    }

    updateImage = () => {

        // Get image
        var image = this._canvas._sketch.toDataURL();

        // Create form data to send
        let data = new FormData();
        data.append('file', image);
        data.append('unique_id', this.props.task_data["task_id"])   
        data.append('turn_idx', this.props.task_data["turn_idx"]) 
        data.append('image_name', this.props.task_data["image_name"])

        // Show the "Is loading" text
        this.setState({loading:"Loading image please be patient", disableConvert:true})

        // Send image        
        axios.post("https://language.cs.ucdavis.edu/", data, {
          headers: {
            'Content-Type': image.type
          }
        }).then((response) => {      
            // Show the image to the user      
            // console.log(response['data']);
            // this.setState({image:response['data'], loading:"", disableConvert:false})
        });   

        // Send image        
        axios.post("https://language.cs.ucdavis.edu/sandbox", data, {
          headers: {
            'Content-Type': image.type
          }
        }).then((response) => {      
            // Show the image to the user      
            console.log(response['data']);
            this.setState({image:response['data'], loading:"", disableConvert:false})
        });   
    }

    render() {
        let frame_height = this.props.frame_height;
        let frame_style = {
                height: frame_height + 'px',
                backgroundColor: 'white',
                padding: '30px',
                overflow: 'auto',
                width:'1100px'
            };        
        let pane_size = this.props.is_cover_page ? 'col-xs-12' : 'col-xs-4';

        return (
            <div style={frame_style} id="left-pane" className={pane_size}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                    <Palate changeColor={this.changeColor} />
                    <Canvas color={this.state.color} ref={c => (this._canvas = c)} />       
                    <Preview image={this.state.image} convertImage={this.updateImage} loading={this.state.loading} disableConvert={this.state.disableConvert}/>

                    <div style={{flexWrap:'wrap', display:'flex', justifyContent:'flex-start', alignItems:'center', width:'300px', margin:'10px'}}> 
                        <p style={{color:'red'}}>READ BELOW CAREFULLY</p>
                        <ul>
                            <li style={{marginBottom:'10px'}}>Do NOT just draw outlines, please FILL IN your DRAWINGS completely</li>
                            <li style={{marginBottom:'10px'}}>You CANNOT control the COLOR or STYLE of your images. Only the POSITION and SIZE. For example, don't worry about the color of the sea or clouds, only that you've drawn them in the right position.</li>                        
                            <li style={{marginBottom:'10px'}}>Only the other turker can submit the task for both of you. Just tell them to click the green "finish task" button</li>
                            <li style={{marginBottom:'10px'}}>You will likely get the bonus if you follow the above tips. Again, do NOT worry if your image color or texture isn't right, only worry about the POSITION and SIZE of the labels.</li>
                        </ul>
                    </div>                  
                </div>
            </div>
        );
    }
}

class OnboardingDrawerUI extends React.Component {

    state = {color:'#3c53a3', image:undefined, loading:"", disableConvert:false}

    changeColor = (color) => {
        this.setState({color:color})
    }

    updateImage = () => {

        // Get image
        var image = this._canvas._sketch.toDataURL();

        // Create form data to send
        let data = new FormData();
        data.append('file', image);
        data.append('unique_id', this.props.task_data["task_id"])   
        data.append('turn_idx', this.props.task_data["turn_idx"]) 
        data.append('image_name', this.props.task_data["image_name"])

        // Show the "Is loading" text
        this.setState({loading:"Loading image please be patient", disableConvert:true})

        // Send image        
        axios.post("https://language.cs.ucdavis.edu/sandbox", data, {
          headers: {
            'Content-Type': image.type
          }
        }).then((response) => {      
            // Show the image to the user      
            console.log(response['data']);
            this.setState({image:response['data'], loading:"", disableConvert:false})
        });   
    }

    render() {
        let frame_height = this.props.frame_height;
        let frame_style = {
                height: frame_height + 'px',
                backgroundColor: 'white',
                padding: '30px',
                overflow: 'auto',
                width:'1200px'
            };        
        let pane_size = this.props.is_cover_page ? 'col-xs-12' : 'col-xs-4';

        return (
            <div style={frame_style} id="left-pane" className={pane_size}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                    <Palate changeColor={this.changeColor} />
                    <Canvas color={this.state.color} ref={c => (this._canvas = c)} />       
                    <Preview image={this.state.image} convertImage={this.updateImage} loading={this.state.loading} disableConvert={this.state.disableConvert}/>

                    <div style={{flexWrap:'wrap', display:'flex', justifyContent:'flex-start', alignItems:'center', width:'300px', margin:'10px'}}> 
                        <p style={{color:'red'}}>READ BELOW CAREFULLY</p>
                        <ul>
                            <li>Do NOT just draw outlines, please FILL IN your DRAWINGS completely</li>
                            <li>You CANNOT control the COLOR or STYLE of your images. Only the POSITION and SIZE. For example, don't worry about the color of the sea or clouds, only that you've drawn them in the right position.</li>                        
                            <li>Only the other turker can submit the task for both of you. Just tell them to click the green "finish task" button</li>
                            <li>You will likely get the bonus if you follow the above tips. Again, do NOT worry if your image color or texture isn't right, only worry about the POSITION and SIZE of the labels.</li>
                        </ul>
                    </div>

                    <iframe src="https://drive.google.com/file/d/1ibp4C7JtNFJ_CiEtdCSnav85E3Y8yvGV/preview" width="1000" height="800"></iframe>
                </div>
            </div>
        );
    }

    // render() {
    //     let frame_height = this.props.frame_height;
    //     let frame_style = {
    //             height: frame_height + 'px',
    //             backgroundColor: 'white',
    //             padding: '30px',
    //             overflow: 'auto',
    //             width:'1100px'
    //         };        
    //     let pane_size = this.props.is_cover_page ? 'col-xs-12' : 'col-xs-4';

    //     return (
    //         <div style={frame_style} id="left-pane" className={pane_size}>
    //             <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>                    
                    
    //             </div>
    //         </div>
    //     );
    // }
}

class TellerImageView extends React.Component {
    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginLeft:'30px'}}>
                <Title text={"Peek Image"} />
                <Subtitle text={"If nothing loads, the other turker hasn't drawn anything yet."} />
                <p>{this.props.loading}</p>
                <img src={this.props.image} style={{width:'300px', height:'300px', backgroundColor:'#f9f9f9', marginBottom:'20px'}} />                
                <button style={{width:'100px', marginBottom:'100px'}} onClick={() => this.props.peek()} disabled={false}>Peek</button>
            </div>
        );
    }
}

class TellerDescribeImageView extends React.Component {
    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginLeft:'30px'}}>
                <Title text={"Image"} />
                <Subtitle text={"This is the image you are sequentially describing."} />                
                <p>{this.props.loading}</p>
                <img src={this.props.image} style={{width:'300px', height:'300px', backgroundColor:'#f9f9f9', marginBottom:'20px'}} />
                <button style={{width:'100px', marginBottom:'100px'}} onClick={() => this.props.loadImage()}>Load Image</button>                           
            </div>
        );
    }
}

class TellerDescribeSemanticImageView extends React.Component {
    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginLeft:'30px'}}>
                <Title text={"Labeled Image"} />
                <Subtitle text={"This is the image with labels for extra clarity."} />                
                <p>{this.props.loading}</p>
                <img src={this.props.image} style={{width:'430px', height:'300px', backgroundColor:'#f9f9f9', marginBottom:'20px'}} />
                <button style={{width:'100px', marginBottom:'100px'}} onClick={() => this.props.loadImage()}>Load Image</button>                           
            </div>
        );
    }
}

class TellerUI extends React.Component {

    state = {loading:'', image:undefined, imageLoading:'', peekImage:undefined, peeked:false, alertShown:false}

    loadImage = () => {

        this.setState({imageLoading:'Loading image'})

        let data = new FormData();        
        data.append('image_name', this.props.task_data["image_name"])

        // alert(this.props.task_data["image_name"]);

        axios.post("https://language.cs.ucdavis.edu/get_image", data).then((response) => {            
            this.setState({image:response['data'], imageLoading:''})
        });  

        axios.post("https://language.cs.ucdavis.edu/get_semantic", data).then((response) => {            
            this.setState({semanticImage:response['data'], imageLoading:''})
        });  
    }

    peek = () => {
        this.setState({loading:"Loading image please be patient"})

        let data = new FormData();        
        data.append('unique_id', this.props.task_data["task_id"])   
        data.append('turn_idx', this.props.task_data["turn_idx"])
        data.append('image_name', this.props.task_data["image_name"])

        axios.post("https://language.cs.ucdavis.edu/peek", data).then((response) => {            
            this.setState({peekImage:response['data'], loading:"Image at turn "+this.props.task_data["turn_idx"], peeked:true})
        });  
    }

    tryToFinishTask = () => {
        if (this.props.task_data["turn_idx"] < 2) {
            alert("Please complete at least 3 turns of dialog before ending the task.");
        }else{
            this.props.onMessageSend("done", {});    
            alert("If the task has not ended yet, it will end as soon as the Drawer (the other turker) sends the final message. Please be patient.");
        }            
    }

    render() {
        let frame_height = this.props.frame_height;
        let frame_style = {
                height: frame_height + 'px',
                backgroundColor: 'white',
                padding: '30px',
                overflow: 'auto',
                width:'1250px'
            };        
        let pane_size = this.props.is_cover_page ? 'col-xs-12' : 'col-xs-4';

        return (
            <div style={frame_style} id="left-pane" className={pane_size}>
                <div style={{display: 'flex', flexDirection:'column'}}>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <TellerDescribeImageView image={this.state.image} loadImage={this.loadImage} loading={this.state.imageLoading} />
                        <TellerDescribeSemanticImageView image={this.state.semanticImage} loadImage={this.loadImage} loading={this.state.imageLoading} />
                        <TellerImageView loading={this.state.loading} image={this.state.peekImage} peek={this.peek} peeked={this.state.peeked} />
                    </div>
                    <button type="button" style={{color:'white', border: 'none', padding:"15px 25px", backgroundColor: '#4CAF50', textAlgin:'center'}} onClick={this.tryToFinishTask}>Finish Task</button>
                </div>
            </div>
        );
    }
}

class EmptyUI extends React.Component {
    render() {
        return <div></div>;
    }
}

// New stuff

const AppContext = React.createContext('context');

class CustomContentLayout extends React.Component {

  triggerSaveImage = () => {
    this.DrawerUI.updateImage();
  }

  render() {
    let layout_style = '2-PANEL'; // Currently the only layout style is 2 panel
    let v_id = this.props.v_id;        
    return (
        <AppContext.Provider>
            <div className="row" id="ui-content">
                <DrawerUI ref={DrawerUI => this.DrawerUI = DrawerUI} {...this.props} layout_style={layout_style} />        
                <RightPane {...this.props} layout_style={layout_style} triggerSaveImage={this.triggerSaveImage} />        
            </div>
        </AppContext.Provider>
    );
  }
}

// extra crazy stuff below

class RightPane extends React.Component {
  handleResize() {
    if (this.chat_pane !== undefined) {
      if (this.chat_pane.handleResize !== undefined) {
        this.chat_pane.handleResize();
      }
    }
  }

  render() {
    let v_id = this.props.v_id;

    // TODO move to CSS
    let right_pane = {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'spaceBetween',
    };

    return (
      <div id="right-pane" style={right_pane}>
        <ChatPane
          message_count={this.props.messages.length}
          {...this.props}
          ref={pane => {
            this.chat_pane = pane;
          }}
        />
        <ResponsePane
            triggerSaveImage={this.triggerSaveImage}
          {...this.props}
          onInputResize={() => this.handleResize()}
        />
      </div>
    );
  }
}

class ResponsePane extends React.Component {
  render() {
    let v_id = this.props.v_id;
    // let XDoneResponse = getCorrectComponent('XDoneResponse', v_id);
    // let XTextResponse = getCorrectComponent('XTextResponse', v_id);
    // let XFormResponse = getCorrectComponent('XFormResponse', v_id);
    // let XIdleResponse = getCorrectComponent('XIdleResponse', v_id);

    let response_pane = null;
    switch (this.props.chat_state) {
      case 'done':
      case 'inactive':
        response_pane = <DoneResponse {...this.props} />;
        break;
      case 'text_input':
      case 'waiting':
        if (this.props.task_data && this.props.task_data['respond_with_form']) {
          response_pane = (
            <FormResponse
              {...this.props}
              active={this.props.chat_state == 'text_input'}
            />
          );
        } else {
          response_pane = (
            <CustomTextResponse
            triggerSaveImage={this.triggerSaveImage}
              {...this.props}
              active={this.props.chat_state == 'text_input'}
            />
          );
        }
        break;
      case 'idle':
      default:
        response_pane = <IdleResponse {...this.props} />;
        break;
    }

    return (
      <div
        id="right-bottom-pane"
        style={{ width: '100%', backgroundColor: '#eee' }}>
        {response_pane}
      </div>
    );
  }
}

class FormResponse extends React.Component {
  // Provide a form-like interface to MTurk interface.

  constructor(props) {
    super(props);
    // At this point it should be assumed that task_data
    // has a field "respond_with_form"
    let responses = [];
    for (let _ of this.props.task_data['respond_with_form']) {
      responses.push('');
    }
    this.state = { responses: responses, sending: false };
  }

  tryMessageSend() {
    let form_elements = this.props.task_data['respond_with_form'];
    let response_data = [];
    let response_text = '';
    let all_response_filled = true;
    for (let ind in form_elements) {
      let question = form_elements[ind]['question'];
      let response = this.state.responses[ind];
      if (response == '') {
        all_response_filled = false;
      }
      response_data.push({
        question: question,
        response: response,
      });
      response_text += question + ': ' + response + '\n';
    }

    if (all_response_filled && this.props.active && !this.state.sending) {
      this.setState({ sending: true });
      this.props.onMessageSend(
        response_text,
        { form_responses: response_data },
        () => this.setState({ sending: false })
      );
      // clear answers once sent
      this.setState(prevState => {
        prevState['responses'].fill('');
        return { responses: prevState['responses']};
      });
    }
  }

  render() {
    let form_elements = this.props.task_data['respond_with_form'];
    const listFormElements = form_elements.map((form_elem, index) => {
      let question = form_elem['question'];
      if (form_elem['type'] == 'choices') {
        let choices = [<option key="empty_option" />].concat(
          form_elem['choices'].map((option_label, index) => {
            return (
              <option key={'option_' + index.toString()}>{option_label}</option>
            );
          })
        );
        return (
          <FormGroup key={'form_el_' + index}>
            <Col
              componentClass={ControlLabel}
              sm={6}
              style={{ fontSize: '16px' }}
            >
              {question}
            </Col>
            <Col sm={5}>
              <FormControl
                componentClass="select"
                style={{ fontSize: '16px' }}
                value={this.state.responses[index]}
                onChange={e => {
                  var text = e.target.value;
                  this.setState(prevState => {
                    let new_res = prevState['responses'];
                    new_res[index] = text;
                    return { responses: new_res };
                  });
                }}
              >
                {choices}
              </FormControl>
            </Col>
          </FormGroup>
        );
      }
      return (
        <FormGroup key={'form_el_' + index}>
          <Col
            style={{ fontSize: '16px' }}
            componentClass={ControlLabel}
            sm={6}
          >
            {question}
          </Col>
          <Col sm={5}>
            <FormControl
              type="text"
              style={{ fontSize: '16px' }}
              value={this.state.responses[index]}
              onChange={e => {
                var text = e.target.value;
                this.setState(prevState => {
                  let new_res = prevState['responses'];
                  new_res[index] = text;
                  return { responses: new_res };
                });
              }}
            />
          </Col>
        </FormGroup>
      );
    });
    let submit_button = (
      <Button
        className="btn btn-primary"
        style={{ height: '40px', width: '100px', fontSize: '16px' }}
        id="id_send_msg_button"
        disabled={
          this.state.textval == '' || !this.props.active || this.state.sending
        }
        onClick={() => this.tryMessageSend()}
      >
        Send
      </Button>
    );

    return (
      <div
        id="response-type-text-input"
        className="response-type-module"
        style={{
          paddingTop: '15px',
          float: 'left',
          width: '100%',
          backgroundColor: '#eeeeee',
        }}
      >
        <Form
          horizontal
          style={{ backgroundColor: '#eeeeee', paddingBottom: '10px' }}
        >
          {listFormElements}
          <FormGroup>
            <Col sm={6} />
            <Col sm={5}>{submit_button}</Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

class DoneResponse extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.props.onInputResize();
  }

  render() {
    let v_id = this.props.v_id;
    
    let inactive_pane = null;
    if (this.props.done_text) {
      inactive_pane = (
        <span id="inactive" style={{ fontSize: '14pt', marginRight: '15px' }}>
          {this.props.done_text}
        </span>
      );
    }
    // TODO maybe move to CSS?
    let pane_style = {
      paddingLeft: '25px',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingRight: '25px',
      float: 'left',
    };
    let button = null;
    if (this.props.task_done) {
      button = <DoneButton {...this.props} />;
    } else if (this.props.subtask_done && this.props.show_next_task_button) {
      button = <NextButton {...this.props} />;
    }
    return (
      <div
        id="response-type-done"
        className="response-type-module"
        style={pane_style}
      >
        {inactive_pane}
        {button}
      </div>
    );
  }
}

class DoneButton extends React.Component {
  // This component is responsible for initiating the click
  // on the mturk form's submit button.

  constructor(props) {
    super(props);
    this.state = {
      feedback_shown: this.props.display_feedback,
      feedback_given: null,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.onInputResize !== undefined) {
      this.props.onInputResize();
    }
  }

  render() {
    let review_flow = null;
    let done_button = (
      <button
        id="done-button"
        type="button"
        className="btn btn-primary btn-lg"
        onClick={() => this.props.allDoneCallback()}
      >
        <span className="glyphicon glyphicon-ok-circle" aria-hidden="true" />{' '}
        Done with this HIT
      </button>
    );
    if (this.props.display_feedback) {
      if (this.state.feedback_shown) {
        // let XReviewButtons = getCorrectComponent(
        //   'XReviewButtons',
        //   this.props.v_id
        // );
        review_flow = (
          <ReviewButtons
            {...this.props}
            onChoice={did_give =>
              this.setState({
                feedback_shown: false,
                feedback_given: did_give,
              })
            }
          />
        );
        done_button = null;
      } else if (this.state.feedback_given) {
        review_flow = <span>Thanks for the feedback!</span>;
      }
    }
    return (
      <div>
        {review_flow}
        <div>{done_button}</div>
      </div>
    );
  }
}

class NextButton extends React.Component {
  // This component is responsible for initiating the click
  // on the next button to get the next subtask from the app

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.onInputResize !== undefined) {
      this.props.onInputResize();
    }
  }
  render() {
    let next_button = (
      <button
        id="next-button"
        type="button"
        className="btn btn-default btn-lg"
        onClick={() => this.props.nextButtonCallback()}
      >
        Next
        <span
          className="glyphicon glyphicon-chevron-right" aria-hidden="true" />{' '}
      </button>
    );

    return (
      <div>
        <div>{next_button}</div>
      </div>
    );
  }
}

class ReviewButtons extends React.Component {
  GOOD_REASONS = ['Not specified', 'Interesting/Creative', 'Other'];

  BAD_REASONS = [
    'Not specified',
    "Didn't understand task",
    'Bad grammar/spelling',
    'Total nonsense',
    'Slow responder',
    'Other',
  ];

  RATING_VALUES = [1, 2, 3, 4, 5];

  RATING_TITLES = [
    'Terrible',
    'Bad',
    'Average/Good',
    'Great',
    'Above and Beyond',
  ];

  constructor(props) {
    super(props);
    let init_state = props.init_state;
    if (init_state !== undefined) {
      this.state = init_state;
    } else {
      this.state = {
        current_rating: null,
        submitting: false,
        submitted: false,
        text: '',
        dropdown_value: 'Not specified',
      };
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.onInputResize !== undefined) {
      this.props.onInputResize();
    }
  }

  render() {
    // Create basic button selector
    let current_rating = this.state.current_rating;
    let button_vals = this.RATING_VALUES;
    let rating_titles = this.RATING_TITLES;
    let buttons = button_vals.map(v => {
      let use_style = 'info';
      if (v < 3) {
        use_style = 'danger';
      } else if (v > 3) {
        use_style = 'success';
      }

      return (
        <Button
          onClick={() =>
            this.setState({
              current_rating: v,
              text: '',
              dropdown_value: 'Not specified',
            })
          }
          bsStyle={current_rating == v ? use_style : 'default'}
          disabled={this.state.submitting}
          key={'button-rating-' + v}
        >
          {rating_titles[v - 1]}
        </Button>
      );
    });

    // Dropdown and other only appear in some cases
    let dropdown = null;
    let other_input = null;
    let reason_input = null;
    if (current_rating != null && current_rating != 3) {
      let options = current_rating > 3 ? this.GOOD_REASONS : this.BAD_REASONS;
      let dropdown_vals = options.map(opt => (
        <MenuItem
          key={'dropdown-item-' + opt}
          eventKey={opt}
          onSelect={key => this.setState({ dropdown_value: key, text: '' })}
        >
          {opt}
        </MenuItem>
      ));
      dropdown = (
        <DropdownButton
          dropup={true}
          componentClass={InputGroup.Button}
          title={this.state.dropdown_value}
          id={'review-dropdown'}
          disabled={this.state.submitting}
        >
          {dropdown_vals}
        </DropdownButton>
      );
    }

    // Create other text
    if (dropdown != null && this.state.dropdown_value == 'Other') {
      // Optional input for if the user says other
      other_input = (
        <FormControl
          type="text"
          placeholder="Enter reason (optional)"
          value={this.state.text}
          onChange={t => this.setState({ text: t.target.value })}
          disabled={this.state.submitting}
        />
      );
    }
    if (dropdown != null) {
      reason_input = (
        <div style={{ marginBottom: '8px' }}>
          Give a reason for your rating (optional):
          <InputGroup>
            {dropdown}
            {other_input}
          </InputGroup>
        </div>
      );
    }

    // Assemble flow components
    let disable_submit = this.state.submitting || current_rating == null;
    let review_flow = (
      <div>
        Rate your chat partner (fully optional & confidential):
        <br />
        <ButtonGroup>{buttons}</ButtonGroup>
        {reason_input}
        <div style={{ marginBottom: '8px' }}>
          <ButtonGroup style={{ marginBottom: '8px' }}>
            <Button
              disabled={disable_submit}
              bsStyle="info"
              onClick={() => {
                this.setState({ submitting: true });
                let feedback_data = {
                  rating: this.state.current_rating,
                  reason_category: this.state.dropdown_value,
                  reason: this.state.text,
                };
                this.props.onMessageSend(
                  '[PEER_REVIEW]',
                  feedback_data,
                  () => this.setState({ submitted: true }),
                  true // This is a system message, shouldn't be put in feed
                );
                this.props.onChoice(true);
              }}
            >
              {this.state.submitted ? 'Submitted!' : 'Submit Review'}
            </Button>
            <Button
              disabled={this.state.submitting}
              onClick={() => this.props.onChoice(false)}
            >
              Decline Review
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
    return review_flow;
  }
}

class ChatPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chat_height: this.getChatHeight() };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.message_count != prevProps.message_count) {
      $('div#message-pane-segment').animate(
        {
          scrollTop: $('div#message-pane-segment').get(0).scrollHeight,
        },
        500
      );
    }
  }

  getChatHeight() {
    let entry_pane = $('div#right-bottom-pane').get(0);
    let bottom_height = 90;
    if (entry_pane !== undefined) {
      bottom_height = entry_pane.scrollHeight;
    }
    return this.props.frame_height - bottom_height;
  }

  handleResize() {
    if (this.getChatHeight() != this.state.chat_height) {
      this.setState({ chat_height: this.getChatHeight() });
    }
  }

  render() {
    let v_id = this.props.v_id;
    // let XMessageList = getCorrectComponent('XMessageList', v_id);
    // let XWaitingMessage = getCorrectComponent('XWaitingMessage', v_id);

    // TODO move to CSS
    let top_pane_style = {
      width: '100%',
      position: 'relative',
    };

    let chat_style = {
      width: '100%',
      height: '100%',
      paddingTop: '60px',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
      overflowY: 'scroll',
    };

    window.setTimeout(() => {
      this.handleResize();
    }, 10);

    top_pane_style['height'] = this.state.chat_height + 'px';

    let wait_message = null;
    if (this.props.chat_state == 'waiting') {
      wait_message = <WaitingMessage {...this.props} />;
    }

    return (
      <div id="right-top-pane" style={top_pane_style}>
        <ChatNavbar {...this.props} />
        <div id="message-pane-segment" style={chat_style}>
          <MessageList {...this.props} />
          {wait_message}
        </div>
      </div>
    );
  }
}

class IdleResponse extends React.Component {
  render() {
    return <div id="response-type-idle" className="response-type-module" />;
  }
}

class ChatMessage extends React.Component {
  render() {
    let float_loc = 'left';
    let alert_class = 'alert-warning';
    if (this.props.is_self) {
      float_loc = 'right';
      alert_class = 'alert-info';
    }
    let duration = null;
    if (this.props.duration !== undefined) {
      let duration_seconds = Math.floor(this.props.duration / 1000) % 60;
      let duration_minutes = Math.floor(this.props.duration / 60000);
      let min_text = duration_minutes > 0 ? duration_minutes + ' min' : '';
      let sec_text = duration_seconds > 0 ? duration_seconds + ' sec' : '';
      duration = (
        <small>
          <br />
          <i>Duration: </i>
          {min_text + ' ' + sec_text}
        </small>
      );
    }
    return (
      <div className={'row'} style={{ marginLeft: '0', marginRight: '0' }}>
        <div
          className={'alert ' + alert_class}
          role="alert"
          style={{ float: float_loc, display: 'table' }}
        >
          <span style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>
            <b>{this.props.agent_id}</b>: {this.props.message}
          </span>
          {duration}
        </div>
      </div>
    );
  }
}

class MessageList extends React.Component {
  makeMessages() {
    let agent_id = this.props.agent_id;
    let messages = this.props.messages;
    // Handles rendering messages from both the user and anyone else
    // on the thread - agent_ids for the sender of a message exist in
    // the m.id field.
    // let XChatMessage = getCorrectComponent('XChatMessage', this.props.v_id);
    let onClickMessage = this.props.onClickMessage;
    if (typeof onClickMessage !== 'function') {
      onClickMessage = idx => {};
    }
    return messages.map((m, idx) => (
      <div key={m.message_id} onClick={() => onClickMessage(idx)}>
        <ChatMessage
          is_self={m.id == agent_id}
          agent_id={m.id}
          message={m.text}
          task_data={m.task_data}
          message_id={m.message_id}
          duration={this.props.is_review ? m.duration : undefined}
        />
      </div>
    ));
  }

  render() {
    return (
      <div id="message_thread" style={{ width: '100%' }}>
        {this.makeMessages()}
      </div>
    );
  }
}

class ConnectionIndicator extends React.Component {
  render() {
    let indicator_style = {
      opacity: '1',
      fontSize: '11px',
      color: 'white',
      float: 'right',
    };
    let text = '';
    switch (this.props.socket_status) {
      case 'connected':
        indicator_style['background'] = '#5cb85c';
        text = 'connected';
        break;
      case 'reconnecting_router':
        indicator_style['background'] = '#f0ad4e';
        text = 'reconnecting to router';
        break;
      case 'reconnecting_server':
        indicator_style['background'] = '#f0ad4e';
        text = 'reconnecting to server';
        break;
      case 'disconnected_server':
      case 'disconnected_router':
      default:
        indicator_style['background'] = '#d9534f';
        text = 'disconnected';
        break;
    }

    return (
      <button
        id="connected-button"
        className="btn btn-lg"
        style={indicator_style}
        disabled={true}
      >
        {text}
      </button>
    );
  }
}

class VolumeControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = { slider_shown: false };
  }

  render() {
    let volume_control_style = {
      opacity: '1',
      fontSize: '11px',
      color: 'white',
      float: 'right',
      marginRight: '10px',
    };

    let slider_style = {
      height: 26,
      width: 150,
      marginRight: 14,
      float: 'left',
    };

    let content = null;
    if (this.state.slider_shown) {
      content = (
        <div style={volume_control_style}>
          <div style={slider_style}>
            <Slider
              onChange={v => this.props.onVolumeChange(v / 100)}
              style={{ marginTop: 10 }}
              defaultValue={this.props.volume * 100}
            />
          </div>
          <Button onClick={() => this.setState({ slider_shown: false })}>
            <span
              style={{ marginRight: 5 }}
              className="glyphicon glyphicon-remove"
            />
            Hide Volume
          </Button>
        </div>
      );
    } else {
      content = (
        <div style={volume_control_style}>
          <Button onClick={() => this.setState({ slider_shown: true })}>
            <span
              className="glyphicon glyphicon glyphicon-volume-up"
              style={{ marginRight: 5 }}
              aria-hidden="true"
            />
            Volume
          </Button>
        </div>
      );
    }
    return content;
  }
}

class ChatBox extends React.Component {
  state = {
    hidden: true,
    msg: '',
  };

  smoothlyAnimateToBottom() {
    if (this.bottomAnchorRef) {
      this.bottomAnchorRef.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }

  instantlyJumpToBottom() {
    if (this.chatContainerRef) {
      this.chatContainerRef.scrollTop = this.chatContainerRef.scrollHeight;
    }
  }

  componentDidMount() {
    this.instantlyJumpToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    // Use requestAnimationFrame to defer UI-based updates
    // until the next browser paint
    if (prevState.hidden === true && this.state.hidden === false) {
      requestAnimationFrame(() => {
        this.instantlyJumpToBottom();
      });
    } else if (prevProps.off_chat_messages !== this.props.off_chat_messages) {
      requestAnimationFrame(() => {
        this.smoothlyAnimateToBottom();
      });
    }
  }

  // TODO: Replace with enhanced logic to determine if the
  // chat message belongs to the current user.
  isOwnMessage = message => message.owner === 0;

  render() {
    const unreadCount = this.props.has_new_message;
    const messages = this.props.off_chat_messages || [];

    return (
      <div style={{ float: 'right', marginRight: 7 }}>
        <Button
          onClick={() => this.setState({ hidden: !this.state.hidden })}
          ref={el => {
            this.buttonRef = el;
          }}
        >
          Chat Messages&nbsp;
          {!!unreadCount && (
            <Badge style={{ backgroundColor: '#d9534f', marginLeft: 3 }}>
              {unreadCount}
            </Badge>
          )}
        </Button>

        <Overlay
          rootClose
          show={!this.state.hidden}
          onHide={() => this.setState({ hidden: true })}
          placement="bottom"
          target={this.buttonRef}
        >
          <Popover id="chat_messages" title={'Chat Messages'}>
            <div
              className="chat-list"
              ref={el => {
                this.chatContainerRef = el;
              }}
              style={{ minHeight: 300, maxHeight: 300, overflowY: 'scroll' }}
            >
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: this.isOwnMessage(message) ? 'right' : 'left',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 4,
                      marginBottom: 10,
                      padding: '5px 10px',
                      display: 'inline-block',
                      ...(this.isOwnMessage(message)
                        ? {
                            marginLeft: 20,
                            textAlign: 'right',
                            backgroundColor: '#dff1d7',
                          }
                        : {
                            marginRight: 20,
                            backgroundColor: '#eee',
                          }),
                    }}
                  >
                    {message.msg}
                  </div>
                </div>
              ))}
              <div
                className="bottom-anchor"
                ref={el => {
                  this.bottomAnchorRef = el;
                }}
              />
            </div>
            <form
              style={{ paddingTop: 10 }}
              onSubmit={e => {
                e.preventDefault();
                if (this.state.msg === '') return;
                this.props.onMessageSend(this.state.msg);
                this.setState({ msg: '' });
              }}
            >
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    value={this.state.msg}
                    onChange={e => this.setState({ msg: e.target.value })}
                  />
                  <InputGroup.Button>
                    <Button
                      className="btn-primary"
                      disabled={this.state.msg === ''}
                      type="submit"
                    >
                      Send
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </form>
          </Popover>
        </Overlay>
      </div>
    );
  }
}

class ChatNavbar extends React.Component {
  state = {
    // TODO: replace hardcoded initial chat state with some API integration
    chat: [{ msg: 'hey', owner: 3 }, { msg: 'anyone else there?', owner: 3 }],
  };

  render() {
    // const displayChatBox = true;
    const displayChatBox = this.props.displayChatBox || false;
    let nav_style = {
      position: 'absolute',
      backgroundColor: '#EEEEEE',
      borderColor: '#e7e7e7',
      height: 46,
      top: 0,
      borderWidth: '0 0 1px',
      borderRadius: 0,
      right: 0,
      left: 0,
      zIndez: 1030,
      padding: 5,
    };
    return (
      <div style={nav_style}>
        <ConnectionIndicator {...this.props} />
        <VolumeControl {...this.props} />
        {displayChatBox && (
          <ChatBox
            off_chat_messages={this.state.chat}
            onMessageSend={msg =>
              this.setState({ chat: [...this.state.chat, { msg, owner: 0 }] })
            }
            has_new_message={2}
          />
        )}
      </div>
    );
  }
}

class Hourglass extends React.Component {
  render() {
    // TODO move to CSS document
    let hourglass_style = {
      marginTop: '-1px',
      marginRight: '5px',
      display: 'inline',
      float: 'left',
    };

    // TODO animate?
    return (
      <div id="hourglass" style={hourglass_style}>
        <span className="glyphicon glyphicon-hourglass" aria-hidden="true" />
      </div>
    );
  }
}

class WaitingMessage extends React.Component {
  render() {
    let message_style = {
      float: 'left',
      display: 'table',
      backgroundColor: '#fff',
    };
    let text = 'Waiting for the next person to speak...';
    if (this.props.world_state == 'waiting') {
      text = 'Waiting to pair with a task...';
    }
    return (
      <div
        id="waiting-for-message"
        className="row"
        style={{ marginLeft: '0', marginRight: '0' }}
      >
        <div className="alert alert-warning" role="alert" style={message_style}>
          <Hourglass />
          <span style={{ fontSize: '16px' }}>{text}</span>
        </div>
      </div>
    );
  }
}

//test

var ContentLayoutHolder = {
    Drawer : CustomContentLayout
}

var LeftPaneHolder = {
  Teller:TellerUI,
  'Onboarding Teller':EmptyUI,
  Drawer:DrawerUI,
  'Onboarding Drawer':OnboardingDrawerUI
};

var TextResponseHolder = {
    Teller:CustomTextResponseTeller
};

export default {  
  XLeftPane: LeftPaneHolder,
  XContentLayout : ContentLayoutHolder,
  XTextResponse : TextResponseHolder

};
