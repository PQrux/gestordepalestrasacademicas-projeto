import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import keys from "./keys";
export default class App extends Component {
  state = {
    valor: "carregando...",
    uid: undefined,
    email: undefined,
    carregando: false,
    error: undefined,
  }
  componentDidMount(){
    let infos = {};
    database().ref("teste").once("value").then(snap=>{
      this.setState({error: snap.val()});
    })
    .catch(err=>{
      this.setState({error: JSON.stringify(err)})
    })
    GoogleSignin.configure({webClientId: keys.googleSignInWebClientId});
    auth().onAuthStateChanged(user=>{
      if(user){
        this.setState({uid: user.uid, email: user.email});
      }
      else{
        this.setState({uid: undefined, email: undefined});
      }
    })
  }
  login = () => {
    GoogleSignin.signIn().then(user=>{
      auth().signInWithCredential(auth.GoogleAuthProvider.credential(user.idToken))
      .catch(err=>{
        console.log(err);
        alert("Erro ao concluir login do firebase.");
        this.setState({error: JSON.stringify(err)})
      })
    })
    .catch(err=>{
      console.log(err);
      alert("Erro ao concluir login do google.");
      this.setState({error: JSON.stringify(err)})
    })
  }
  logout = () => {
    this.setState({carregando: true});
    GoogleSignin.signOut()
    .catch(err=>{
      console.log(err);
      this.setState({carregando: false});
      alert("Erro ao sair do google!");
    })
    auth().signOut()
    .then(()=>{
      this.setState({carregando: false});
    })
    .catch(err=>{
      console.log(err);
      this.setState({carregando: false});
      alert("Erro ao sair do firebase!");
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Bem vindo ao loginizator 5000!</Text>
        <Text>
          {
            this.state.uid ? 
            `Seu e-mail é: ${this.state.email}, e seu uid: ${this.state.uid}.` :
            `Você está desconectado!`
          }
        </Text>
        <GoogleSigninButton 
          disabled={this.state.carregando||this.state.uid ? true : false}
          onPress={this.login}
        />
        <TouchableOpacity
          disabled={this.state.carregando||!this.state.uid}
          onPress={this.logout}
        >
          <Text>Sair</Text>
        </TouchableOpacity>
        <Text>
          {this.state.error}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});