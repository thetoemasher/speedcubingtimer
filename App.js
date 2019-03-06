/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight, Button} from 'react-native';
import { BaseButton, PanGestureHandler, State} from 'react-native-gesture-handler'
import moment from 'moment'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// type Props = {};
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      button1: false,
      button2: false,
      shouldStart: false,
      start: false,
      timerStart: 0,
      timerNow: 0,
    }
  }

  handlePress (button, state){
      if(state === State.BEGAN) {
        this.setState({[button]: true})
      } else {
        this.setState({[button]: false})
      }
  }
  _onHandlerStateChange = (e, button) => {
    let notCurrent = button === 'button1' ? 'button2' : 'button1' 
    let truth = e.nativeEvent.state === State.BEGAN || e.nativeEvent.state === State.ACTIVE
    if(this.state.shouldStart && !truth && !this.state.timerStart) {
      this.startTimer()
      return this.setState({start: true, [button]: truth, shouldStart: false})
    }
    if(truth && this.state[notCurrent]) {
      if(!this.state.start) {
        if(!this.timeout && !this.state.timerStart) {
          this.timeout = setTimeout(() => {
              this.setState({shouldStart: true})
          }, 1000);
        }
        return this.setState({[button]: truth})
      } else {
        if(this.timerInterval) {
          clearInterval(this.timerInterval)
          this.timerInterval = null
        }
        return this.setState({start: false, [button]: truth})
      } 
    } else {
      if(this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    }
    this.setState({[button]: truth})
  }

  startTimer = () => {
    let now = new Date().getTime()
    this.setState({
      timerStart: now,
      timerNow: now
    })
    this.timerInterval = setInterval(() => {
      this.setState({timerNow: new Date().getTime()})
    }, 10)
  }
  pad(n) {
    return n < 10 ? '0' + n : n
  }
  
  resetTimer = () => {
    if(!this.state.start) {
      this.setState({
        timerStart: 0, 
        timerNow: 0,
        start: false
      })
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  render() {
    let {pad} = this
    let {timerNow, timerStart} = this.state
    if(!this.state.start) {
      clearInterval(this.timerInterval)
    }
    const button1 = React.createRef()
    const button2 = React.createRef()

    let duration = moment.duration(timerNow - timerStart)
    let time = `${pad(duration.minutes())}:${pad(duration.seconds())}.${pad(Math.floor(duration.milliseconds() / 10))}`
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <PanGestureHandler 
            ref={button1} 
            simultaneousHandlers={button2} 
            onHandlerStateChange={(e) => this._onHandlerStateChange(e, 'button1')}>
            <Text 
              style={{...styles.button, ...styles.button1}}>
            </Text>
          </PanGestureHandler>

          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.state.button1 && this.state.button2 && <Text style={{color: 'red', fontSize: 25}}>.</Text>}
              {this.state.shouldStart && <Text style={{color: 'green', fontSize: 25}}>.</Text>}
              <Button onPress={this.resetTimer} title='Reset'></Button>
            </View>
            <Text>{time}</Text>
          </View>

          <PanGestureHandler 
          style={{flex: 1}}
            ref={button2} 
            simultaneousHandlers={button1} 
            onHandlerStateChange={(e) => this._onHandlerStateChange(e, 'button2')}>
            <Text 
              style={styles.button}>
            </Text>
          </PanGestureHandler>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    height: '100%', 
    width: 150,
    backgroundColor: 'lightblue'
  },
});
