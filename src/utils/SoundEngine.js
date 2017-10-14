class SoundsEngine { 
	
	playSound(/* Sound */ sound, /*float [0-1]*/volume){

		if(sound)
		{			
			sound.volume=volume;
			sound.play();
			sound.currentTime=0;
		}		
	}
}

let soundsEngine = new SoundsEngine();

export {soundsEngine};
