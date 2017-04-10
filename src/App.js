import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';

class App extends Component {

  constructor(){
    super();
    this.state = {lista : [], nome:'', email:'', senha:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  componentDidMount(){
    console.log("didMount");
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: function(resposta){
        console.log("chegou resposta");
        this.setState({lista:resposta});
      }.bind(this)
    });
  }

  enviaForm(evento){
    evento.preventDefault();
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      contentType: 'application/json',
      xhrFields: { withCredentials: true },
      crossDomain: true,
      type: 'post',
      dataType: "json",
      data: JSON.stringify({nome:this.state.nome, email:this.state.email,senha:this.state.senha}),
      success: function(resposta){
        console.log("cadastrou autor com sucesso");
        this.setState({lista:resposta});
      }.bind(this),
      error: function(resposta){
        console.log('erro',resposta);
      }
    });
  }

  setNome(evento){
    this.setState({nome:evento.target.value});
  }

  setEmail(evento){
    this.setState({email:evento.target.value});
  }

  setSenha(evento){
    this.setState({senha:evento.target.value});
  }

  render() {
    console.log('render');
    return (
      <div id="layout">
    
        <a href="#menu" id="menuLink" className="menu-link">
            
            <span></span>
        </a>

        <div id="menu">
            <div className="pure-menu">
                <a className="pure-menu-heading" href="#">Company</a>

                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>

                    
                </ul>
            </div>
        </div>

        <div id="main">
            <div className="header">
              <h1>Cadastro de Autores</h1>
            </div>
            <div className="content" id="content">
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method='post'> 
                    <InputCustomizado id='nome' type='text' name='nome' value={this.state.nome} onChange={this.setNome} label='Nome'/>
                    <InputCustomizado id='email' type='email' name='email' value={this.state.email} onChange={this.setEmail} label='Email'/>
                    <InputCustomizado id='senha' type='password' name='senha' value={this.state.senha} onChange={this.setSenha} label='Senha'/>
                    <BotaoSubmitCustomizado className='pure-button pure-button-primary' type='submit' value="Gravar" />
                </form>             

              </div>  
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
            </div>
        </div>            
      </div>
    );
  }

}

export default App;
