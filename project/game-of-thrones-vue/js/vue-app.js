Vue.transition('bounce', {
	  enterClass: 'bounceInLeft',
	  leaveClass: 'bounceOutRight'
	});
	
var vm = new Vue({
	config : {
		debug  : true
	},
	el : 'body',
	data : {
		srcList : [400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423],
		carouselConfig:{
			activeItem : 0,
			lastItem: -1,
			interval: null,
		    sliding: null,
		    paused: null,
		    inClass: 'bounceInRight',
		    outClass: 'bounceOutLeft'
		}
	},
	methods : {
		carousel : function(option) {
			if (typeof option == 'number' || option == 'prev' || option == 'next') this.pause().slide(option);
		      else if (option == 'cycle') this.pause().cycle();
		      else if (option == 'pause') this.pause();
		      else if (options.interval) this.pause().cycle(options);
		},
		slide : function(option){
			if(parseInt(option) == vm.carouselConfig.activeItem){
				this.pause();
				return;
			}

			vm.carouselConfig.lastItem = vm.carouselConfig.activeItem;
			if(option == 'next' || parseInt(option) > vm.carouselConfig.activeItem){
				vm.carouselConfig.outClass = 'bounceOutLeft';
				
				setTimeout(function(){
					if(option == 'next'){
						if(vm.carouselConfig.activeItem < vm.srcList.length - 1)
							vm.carouselConfig.activeItem ++;
						else
							vm.carouselConfig.activeItem = 0;
					}else if(typeof option == 'number'){
						vm.carouselConfig.activeItem = parseInt(option);
					}
					vm.carouselConfig.inClass = 'bounceInRight';
				},500);
			}else if(option == 'prev' || parseInt(option) < vm.carouselConfig.activeItem){
				vm.carouselConfig.outClass = 'bounceOutRight';
				
				setTimeout(function(){
					if(option == 'prev'){
						if(vm.carouselConfig.activeItem > 0)
							vm.carouselConfig.activeItem --;
						else
							vm.carouselConfig.activeItem = vm.srcList.length - 1;
					}else if(typeof option == 'number'){
						vm.carouselConfig.activeItem = parseInt(option);
					}
					vm.carouselConfig.inClass = 'bounceInLeft';
				},500);
			}
		},
		cycle: function(options){
			var interval = options && options.interval ? options.interval : 2000;
			vm.interval = setInterval(function(){
				vm.slide('next');
			},interval);
			vm.carouselConfig.sliding = true;
			vm.carouselConfig.paused = false;
		},
		pause: function(){
			if(vm.carouselConfig.sliding){
				clearInterval(vm.interval);
				vm.carouselConfig.sliding = false;
				vm.carouselConfig.paused = true;
			}
			return vm;
		}
	}
}); 

//vm.cycle({'interval' : '2000'});

function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}