import React from 'react';

class AbilityButton extends React.Component {
		render() {
		return (
				  <div className="square">
					   <img src={this.props.ability.img} className="square" onClick={() => this.props.onClick(this.props.ability)} />
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
          abilities.push(<AbilityButton ability={this.state.unit.abilities[i]} key={i} onClick={abil => this.props.setActiveAbility(abil)}/>);
      }


		return ( 
		  <div className="abilities_list">
			  {abilities}
		  </div>
	  );
  }
}

export {AbilitiesPanel};
