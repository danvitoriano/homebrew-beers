import React, { component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component{

	//constructor
	constructor(){
		super();
		this.state = {nome:'',email:'',senha:''};
		this.enviaForm = this.enviaForm.bind(this);
		this.setNome = this.setNome.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.setSenha = this.setSenha.bind(this);
	}

	//submit form
	enviaForm(evento){
		evento.preventDefault();
		$.ajax({
			url: 'http://cdc-react.herokuapp.com/api/autores',
			contentType: 'application/json',
			xhrFields: { withCredentials: true },
			crossDomain: true,
			type: 'post',
			dataType: "json",
			data: JSON.stringfy({nome.this.state.nome,email:this.state.email,senha:this.state.senha}),
			success: function(novaListagem){
				//publisher novaListagem
				PubSub.publish('atualiza-lista-autores', novaListagem);
				this.setState({nome:'', email:'', senha:''})	
			}.bind(this),
			error: function(resposta){
				if(resposta.status === 400){
					//new error function
					new TratadorErros().publicaErros(resposta.responseJSON);
				}
			},
			beforeSend: function(){
				//publisher limpa-erros before send
				PubSub.publish("limpa-erros",{});
			}
		});
	}

	// set methods
	setNome(evento){
		this.setState({nome:evento.target.value});
	}

	setEmail(evento){
		this.setState({email:evento.target.value});
	}

	setSenha(evento){
		this.setState({senha:evento.target.value});
	}

	// render
	render(){
		return(
			<div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method='post'> 
                    <InputCustomizado id='nome' type='text' name='nome' value={this.state.nome} onChange={this.setNome} label='Nome'/>
                    <InputCustomizado id='email' type='email' name='email' value={this.state.email} onChange={this.setEmail} label='Email'/>
                    <InputCustomizado id='senha' type='password' name='senha' value={this.state.senha} onChange={this.setSenha} label='Senha'/>
                    <BotaoSubmitCustomizado className='pure-button pure-button-primary' type='submit' value="Gravar" />
                </form>             
              </div>  
		);
	}
}

class TabelaAutores extends Component{
	// render
	render(){
	    <div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.lista.map(function(autor){
                    return (
                      <tr key={autor.id}>
                        <td>{autor.nome}</td>
                        <td>{autor.email}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table> 
          </div>   
	}
}

export default class AutorBox extends Component{

	//constructor
	constructor(){
		super();
		this.state = {lista: []};
	}

	//when component did mount do this
	componentDidMount(){
		$.ajax({
			url: 'http://cdc-react.herokuapp.com/api/autores',
			dataType: 'json',
			success: function(resposta){
				console.log("chegou resposta");
				this.setState({lista:resposta});
			}.bind(this)
		});

		//subscribe to atualiza-lista-autores
		PubSub.subscribe('atualiza-lista-autores', function(topico,novaLista){
			this.setState({lista:novaLista});
		}.bind(this));
	}

	//render
	render(){
		return(
			<div>
				<FormularioAutor/>
				<TabelaAutores lista={this.state.lista}/>
			</div>
		);
	}
}