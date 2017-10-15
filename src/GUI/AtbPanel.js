import React from 'react';

class UnitOnAtb extends React.Component {
		render() {
		return (
				  <div className="square">
					   <img src={this.props.unit.picsrc} className="square" onClick={() => this.props.onClick(this.props.ability)} alt={this.props.unit.name} />
                  </div>
			);
		}
}




class AtbPanel extends React.Component {
	

  render() {

      let units = [];
      if(this.props.atb){
		  for (let i = 0; i < this.props.atb.unitsInAtb.length; i++) {
			  units.push(<UnitOnAtb unit={this.props.atb.unitsInAtb[i]} key={i} />); //onClick={abil => this.props.setActiveAbility(abil)}
		  }
      }

		return ( 
		  <div className="atb_list">
			  {units}
		  </div>
	  );
  }
}

export {AtbPanel};
