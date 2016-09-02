Vue.transition('bounce', {
	  enterClass: 'bounceInLeft',
	  leaveClass: 'bounceOutRight'
	})
	
new Vue({
	config : {
		debug  : true
	},
	el : 'body',
	data : {
		srcList : [400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423],
		show_400 : true
	},
	methods : {
		removeTodo : function() {
			this.show = !this.show;
			this.picName = random(400,424) + ".jpg";
		}
	}
}); 

function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}