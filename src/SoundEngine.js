class SoundEngine { 
	
	constructor( soundsDict ) {
		
		this.soundsDict = soundsDict;
	
	  }

	playSound(/* String */id){
		let sound = this.soundsDict[id];
		if(sound)
		{
			
			sound.play();
			sound.currentTime=0;
		}
			
		
	}
	  
	
}


module.exports.SoundEngine = SoundEngine;
