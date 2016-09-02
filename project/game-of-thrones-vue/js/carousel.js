var vm = new Vue({
	el : 'body',
	data : {
		srcList : [401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423],
		interval : ""
	},
	methods : {
		changeCraousel : function() {
			vm.pauseCraousel();
			setTimeout(
				function(){
					var rd = vm.random(401,424),
						changeList = [];
					for(var i=401; i<=rd; i++){
						changeList.push(i);
					}

//					if($(".carousel-indicators li.active").length == 0){
//						 $("#myCarousel").carousel(0); 
//					}
					if($(".carousel-indicators li.active").attr("data-slide-to") > changeList.length){
						 $("#myCarousel").carousel(changeList.length); 
					}
					
					setTimeout(
							function(){
								vm.srcList = changeList;
							},2000);
					setTimeout(
							function(){
					$("#myCarousel").carousel('cycle');
							},4000);
//					console.log(rd);
			},2000);
		},
		random : function(min,max){
		    return Math.floor(min+Math.random()*(max-min));
		},
		pauseCraousel : function(){
			$("#myCarousel").carousel('pause');
		},
		runCraousel : function(){
			$("#myCarousel").carousel('cycle');
			setInterval('vm.changeCraousel()',10*1000); 
		},
		creatCraousel : function(){

			$("#myCarousel").carousel('pause');
			vm.srcList = [];
			
//			$("#myCarousel").carousel('pause');
			setTimeout(function(){
//				$("#myCarousel").carousel('pause');
				vm.srcList = [401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423];
				$('#myCarousel').carousel('cycle');
			},5000);
		},
		emptyCraousel : function(){
			$("#myCarousel").carousel('pause');
			vm.srcList = [];
		}
	}
});

//vm.runCraousel();