import React, {Component} from 'react';

export default class BotaoSubmitCustomizado extends Component{
	render(){
		return(
			<div className="pure-control-group">                                  
			<label></label> 
			<input type={this.props.type} className={this.props.className} value={this.props.value}/>                                    
			</div>
		);
	}
}