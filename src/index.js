import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './grid.js'


class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
  }
	
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button> 
    );
  }
}

class Character extends React.Component {
	  render() {
		return (		
		<div id="theHero"/>  
		);
	  }
  }

class Board extends React.Component {
		constructor() {
		super();
		this.state = {
			hero_x: 0,
			hero_y: 0,
		  squares: Array(9).fill(null),
		};
	}
	
  renderSquare(i) {
    return (<Square 
		value={this.state.squares[i]} 
		onClick={() => this.handleClick(i)}
	/>);
  }
  
   handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  render() {
    const status = 'Next player: X';
    return (
      <div id="hexCanvas">
        	<Character/>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
	<div>
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>		
      </div>	  
	</div>
    );
  }
}

function myFunction(){
	alert("wow");
}

function myHeroWasClicked(){
	alert("got_clicked!");
}

var y=0;
var x=0;
var dx = 110.8512517
var dy = 128
document.onkeydown = function(evt) {
    evt = evt || window.event;
    
	//q
	if (evt.keyCode == 81) {
		
		x+=dx;
		y-=dy/2;
		document.getElementById("theHero").style.right = x+"px";
        document.getElementById("theHero").style.top = y+"px";
		
    }
	
	//w
	if (evt.keyCode == 87) {
		

		y-=dy; //fds

        document.getElementById("theHero").style.top = y+"px";
		
    }
	
	//e
	if (evt.keyCode == 69) {
		
		x-=dx;
		y-=dy/2;
		document.getElementById("theHero").style.right = x+"px";
        document.getElementById("theHero").style.top = y+"px";
		
    }
	
	//a
	if (evt.keyCode == 65) {
		
		x+=dx;
		y+=dy/2;
		document.getElementById("theHero").style.right = x+"px";
        document.getElementById("theHero").style.top = y+"px";
    }
	
	//s
	if (evt.keyCode == 83) {
		

		y+=dy;

        document.getElementById("theHero").style.top = y+"px";
    }
	
	//d
	if (evt.keyCode == 68) {
		
		x-=dx
		y+=dy/2;
		document.getElementById("theHero").style.right = x+"px";
        document.getElementById("theHero").style.top = y+"px";
    }
	
	
	
};

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
