import React from 'react';

class AbilityButton extends React.Component {
		render() {
		return (
				  <div className="square">
					   <img src={this.props.ability.img} className="square" onClick={() => this.props.onClick(this.props.ability)} alt={this.props.ability.name} />
                  </div>
			);
  }
}




class AbilitiesPanel extends React.Component {

  render() {

      let abilities = [];

      if(this.props.unit && this.props.unit.abilities){
		  	for (let i = 0; i < this.props.unit.abilities.length; i++) {
			  abilities.push(<AbilityButton ability={this.props.unit.abilities[i]} key={i} onClick={abil => this.props.setActiveAbility(abil)}/>);
		  }
	  }


		return ( 
		  <div className="abilities_list">
			  {abilities}
		  </div>
	  );
  }
}

export {AbilitiesPanel};
