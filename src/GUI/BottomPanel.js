import React from 'react';
import {AbilitiesPanel} from "./AbilitiesPanel"
import {Damage} from "../battle_system/Damage"
import {Armor} from "../battle_system/Armor"
import {AtbPanel} from "./AtbPanel"

class AttributeDisplay extends React.Component {
		render() {
		return (<div className="board-row">
				  <img className="square" src={this.props.img} alt={this.props.attributeName}/>
				  <div className="square"> {this.props.num} </div>
			</div>);
  }
}

class ArmorDisplay extends React.Component {
	
	render(){
		return(
		<div className="armor">
			<AttributeDisplay img={Armor.icons.SLASH} num={this.props.armor.SLASH} />
			<AttributeDisplay img={Armor.icons.PIERCE} num={this.props.armor.PIERCE} />
			<AttributeDisplay img={Armor.icons.MAGIC} num={this.props.armor.MAGIC} />
        </div>
		);
	}
}

class DamageDisplay extends React.Component {	
	render(){
		return(
		<div className="damage">
			<AttributeDisplay img={Damage.icons[this.props.damage.type]} num={this.props.damage.amount} />
        </div>
		);
	}
}

class UnitFace extends React.Component {	
	
	render(){
		return(
		<div className="unit_face">
			<img src={this.props.img} className="avaPic" alt={this.props.name}/>
			<label> {this.props.name} </label>
			<div> {this.props.HP.value}/{this.props.HP.maxValue} </div>
			
			<progress className = "hp_bar" value={this.props.HP.value} 
						max={this.props.HP.maxValue}> 
						</progress>
        </div>
		);
	}
}

class UnitStats extends React.Component {
	
	render(){
		
		if(this.props.unit){
				
			return(			
			<div className="unit_view">
			<div className="inner_unit_view">
					<UnitFace img = {this.props.unit.picsrc}
					name = {this.props.unit.name}
					HP = {this.props.unit.HP}/>
					<DamageDisplay damage={this.props.unit.meleeDamage}/>
					<ArmorDisplay armor={this.props.unit.armor}/>
			</div> </div>
			);
		} else {
			return (
			<div className="unit_view">
			<div className="inner_unit_view">
					UnitStats: no unit found	
			</div> </div>);} 
		}
}


class BottomPanel extends React.Component {
	
	constructor(props) {
			  super(props);
			  this.state = {
				selectedUnit : props.selectedUnit,
				unit : props.unit,
				  atb: props.atb
			  };
		}
		
		update(hero, selected, atb){
			if(this.state.hero!==hero || this.state.selectedUnit!==selected)
			{
				this.setState({unit: hero, selectedUnit: selected, atb: atb});
			}
		}
		
		
	
  render() {
		return (
			<div className="bottom_panel">
					<div className="abilities_panel">
						<AbilitiesPanel unit={this.state.unit} setActiveAbility={abil => this.props.setActiveAbility(abil)}/>
					</div>
					<div className="units_view_in_pb">

						<UnitStats unit={this.state.unit}/>
						<UnitStats unit={this.state.selectedUnit}/>
				  </div>
					<div className="atb_panel">
					<AtbPanel atb={this.state.atb}/>
				</div>
			</div>
	  );
  }
}

export {BottomPanel};
