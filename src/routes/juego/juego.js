import React from 'react'
import Header from '../../components/header/header'
// import PropTypes from 'prop-types'

export class Juego extends React.Component {
  constructor( opts ){
    super(opts);
    console.log(opts);
  }
  render() {
    return (
      <div>
        <Header></Header>
        <div>{ this.props.match.params.tipo }</div>
      </div>
    )
  }
}