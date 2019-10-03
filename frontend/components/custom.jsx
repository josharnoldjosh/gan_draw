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

  state = {selectedButton:0, selectedSize:0}

  render() {
    return (
      <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', margin:'10px', alignItems:'flex-start', marginTop:'20px', backgroundColor:"#f9f9f9"}}>

        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', margin:'10px', padding:'10px', width:'361px', marginTop:'0px'}}>
            <Subtitle text={"Tools: "} />            
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedButton == 0 ? '5px' : '0px'}} onClick={() => {this.props.updateTool(Tools.Pencil); this.setState({selectedButton:0})}}>Pencil</button>            
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedButton == 1 ? '5px' : '0px'}} onClick={() => {this.props.updateTool(Tools.Line); this.setState({selectedButton:1})}}>Line</button>
            <button style={{margin:'7px', backgroundColor:'white', borderColor:'red', borderWidth: this.state.selectedButton == 2 ? '5px' : '0px'}} onClick={() => {this.props.updateTool(Tools.Rectangle); this.setState({selectedButton:2})}}>Rectangle</button>
            <button style={{margin:'7px', backgroundColor:'white', borderWidth:'0px'}} onClick={() => this.props.undo()}>Undo</button>                
        </div>

        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', margin:'10px', padding:'10px', width:'320px', marginTop:'0px'}}>
            <Subtitle text={"Brush & Line size: "} />            
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

                <div style={{flexWrap:'wrap', display:'flex', justifyContent:'flex-start', alignItems:'center', width:'100px', margin:'20px'}}>                                
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#6eb4e8', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 0 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#6eb4e8'); this.setState({selectedButton:0})}} >Sky</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#3c53a3', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 1 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#3c53a3'); this.setState({selectedButton:1})}} >Sea</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#807761', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 2 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#807761'); this.setState({selectedButton:2})}} >Mountain</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#635f5d', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 3 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#635f5d'); this.setState({selectedButton:3})}} >Rock</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#6c9460', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 4 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#6c9460'); this.setState({selectedButton:4})}} >Hill</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#f2dae3', color:'black', borderColor: 'red', borderWidth: this.state.selectedButton == 5 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#f2dae3'); this.setState({selectedButton:5})}} >Clouds</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#d6c77c', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 6 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#d6c77c'); this.setState({selectedButton:6})}} >Sand</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#918491', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 7 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#918491'); this.setState({selectedButton:7})}} >Gravel</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#ededed', color:'black', borderColor: 'red', borderWidth: this.state.selectedButton == 8 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#ededed'); this.setState({selectedButton:8})}} >Snow</button>                                                                                
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#65a398', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 9 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#65a398'); this.setState({selectedButton:9})}} >River</button>                                                                                                
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#469632', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 10 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#469632'); this.setState({selectedButton:10})}} >Bush</button>                                                                        
                </div>                    

                <div style={{flexWrap:'wrap', display:'flex', justifyContent:'flex-start', alignItems:'flex-start', width:'100px', margin:'20px'}}>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#87ab6f', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 11 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#87ab6f'); this.setState({selectedButton:11})}} >Tree</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#414a4a', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 12 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#414a4a'); this.setState({selectedButton:12})}} >Road</button>   
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#d160cb', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 13 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#d160cb'); this.setState({selectedButton:13})}} >Platform</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#967e54', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 14 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#967e54'); this.setState({selectedButton:14})}} >Dirt</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#53634e', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 15 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#53634e'); this.setState({selectedButton:15})}} >Ground-other</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#784b26', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 16 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#784b26'); this.setState({selectedButton:16})}} >Mud</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#8d9fb8', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 17 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#8d9fb8'); this.setState({selectedButton:17})}} >Fog</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#9c9c9c', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 18 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#9c9c9c'); this.setState({selectedButton:18})}} >Stone</button>
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#526bd9', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 19 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#526bd9'); this.setState({selectedButton:19})}} >Water</button>  
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#e6be30', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 20 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#e6be30'); this.setState({selectedButton:20})}} >Flower</button>                    
                    <button style={{width:'100px', margin:'5px', backgroundColor:'#71cc2b', color:'white', borderColor: 'red', borderWidth: this.state.selectedButton == 21 ? '5px':'0px'}} onClick={() => {this.props.changeColor('#71cc2b'); this.setState({selectedButton:21})}} >Grass</button>               
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
    brushSize:15,
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
          width='350px' 
          height='350px'
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
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginLeft:'30px'}}>
                <Title text={"Preview"} />
                <Subtitle text={"This is where you see your final image."} />
                <p>{this.props.loading}</p>
                <img src={this.props.image} style={{width:'300px', height:'300px', backgroundColor:'#f9f9f9', marginBottom:'20px'}} />                
                <button style={{width:'100px', marginBottom:'120px'}} onClick={() => this.props.convertImage()} disabled={this.props.disableConvert}>Convert</button>
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
            console.log(response['data']);
            this.setState({image:response['data'], loading:"", disableConvert:false})
        });  
        
        // // Save our image physically on our server
        // axios.post("https://language.cs.ucdavis.edu/save_image", data, {
        //   headers: {
        //     'Content-Type': image.type
        //   }
        // })  
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
                </div>
            </div>
        );
    }
}

class TellerImageView extends React.Component {
    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginLeft:'30px'}}>
                <Title text={"Peek Image"} />
                <Subtitle text={"You can only peek once during the task."} />
                <p>{this.props.loading}</p>
                <img src={this.props.image} style={{width:'300px', height:'300px', backgroundColor:'#f9f9f9', marginBottom:'20px'}} />                
                <button style={{width:'100px', marginBottom:'100px'}} onClick={() => this.props.peek()} disabled={this.props.peeked}>Peek</button>
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

class TellerUI extends React.Component {

    state = {loading:'', image:undefined, imageLoading:'', peekImage:undefined, peeked:false}

    loadImage = () => {

        this.setState({imageLoading:'Loading image'})

        let data = new FormData();        
        data.append('image_name', this.props.task_data["image_name"])

        // alert(this.props.task_data["image_name"]);

        axios.post("https://language.cs.ucdavis.edu/get_image", data).then((response) => {            
            this.setState({image:response['data'], imageLoading:''})
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

    render() {
        let frame_height = this.props.frame_height;
        let frame_style = {
                height: frame_height + 'px',
                backgroundColor: 'white',
                padding: '30px',
                overflow: 'auto',
                width:'700px'
            };        
        let pane_size = this.props.is_cover_page ? 'col-xs-12' : 'col-xs-4';

        return (
            <div style={frame_style} id="left-pane" className={pane_size}>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <TellerDescribeImageView image={this.state.image} loadImage={this.loadImage} loading={this.state.imageLoading} />
                    <TellerImageView loading={this.state.loading} image={this.state.peekImage} peek={this.peek} peeked={this.state.peeked} />
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

var LeftPaneHolder = {
  Teller:TellerUI,
  'Onboarding Teller':EmptyUI,
  Drawer:DrawerUI,
  'Onboarding Drawer':DrawerUI
};

export default {  
  XLeftPane: LeftPaneHolder
};
