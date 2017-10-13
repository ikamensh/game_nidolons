import React from 'react';

class AbilityButton extends React.Component {
		render() {
		return (
				  <div className="square">
					   <img src={this.props.img}/>
                  </div>
			);
  }
}




class AbilitiesPanel extends React.Component {
	
	constructor(props) {
			  super(props);
			  this.state = {
				unit : props.unit
			  };
		}
		
	
  render() {

      let abilities = [];
      for (let i = 0; i < this.state.unit.abilities.length; i++) {
          abilities.push(<AbilityButton src={this.state.unit.abilities[i].img} key={i}/>);
      }


		return ( 
		  <div className="board-row">
			  {abilities}
		  </div>
	  );
  }
}

export {AbilitiesPanel};
