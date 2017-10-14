class DisappearingText {
	
	constructor( txt, x, y, lifetime, fadetime, size, animation, color)
	{

	this.txt = txt;
	this.x = x;
	this.y = y;
	this.lifetime = lifetime;
	this.fadetime = fadetime;
	this.size = size;
	this.animation = animation;
	this.color = color;
		
	}
	
	draw(ctx) {
		let alpha=1;
		if(this.lifetime){
			this.lifetime--;
		} else if (this.fadetime){
            alpha = this.fadetime.getPercentageFull();
			this.fadetime.value--;
		} else {			
			return true;
		}
		
		ctx.save();

        let colorStroke = 'rgba('+this.color.R +',' +this.color.G+',' +this.color.B+',' +alpha +')';
		
		if(this.animation){
			let animationDisplacement = this.animation.calculateAnimDisplacement();
			if(/*Point */ animationDisplacement){
				ctx.translate(animationDisplacement.x,animationDisplacement.y);
			}
		}
		
		ctx.fillStyle = colorStroke;
		ctx.font = "bolder "+this.size+"pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.fillText(this.txt, this.x, this.y);
		
			
		ctx.restore();	  
	}		
	
}

export {DisappearingText};

