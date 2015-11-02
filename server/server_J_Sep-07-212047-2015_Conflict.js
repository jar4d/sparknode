Meteor.startup(function(){
	if(BertStatus.find().count() == 0){
			BertStatus.insert({
				createdAt: new Date(),//hacky - this needs to change!
				idInc: 0
			});
	}
	else if(InOutDurationDB.find().count() == 0){
		InOutDurationDB.insert({
			timeOutsideTotal: 0,
			timeInsideTotal: 0
		});
	}
});




var spark = Meteor.npmRequire('sparknode');

var core = new spark.Core({accessToken:'7d93919b511589ea1cdd0dce7e8359d0e6570064',id:'40003c000c47343432313031'});

//CORE EVENT SYNTAX: core.on(eventName, function handler(eventData) {/*do something;*/});
//Watches for an event, logs numerically into database. Wraps as an Async function.
core.on('bertStatus', Meteor.bindEnvironment(function handler(eventData) {
	//console.log(eventData);
	console.log("logging bertStatus event data..");
	bertStatusString = eventData.data;
	if (bertStatusString == 'I\'m out!'){
		bertStatus = 1
	}
	else if (bertStatusString == 'I\'m in!'){
		bertStatus = 0
	}

    currentIdInc = BertStatus.findOne({},{sort:{idInc:-1}}).idInc || 1;

	BertStatus.insert({
              bertStatus: bertStatus,
              bertStatusString: bertStatusString,
              createdAt: new Date(),
              idInc: currentIdInc + 1
              });

	Meteor.bindEnvironment(function inOut(){
	//update calculation for the time bert is IN and OUT. REMEBER 1 is OUT.
	//increment through records
	    var totalInOutRecords = BertStatus.find({}).count();
		for (var i = 0; i < totalInOutRecords; i++) {
		
		 firstVar = BertStatus.findOne( 
			{ bertStatus: 1 }, 
			{ sort: { createdAt: -1 } }, 
			{ set: { idInc: i } } 
			);
		firstVarTime = Date.parse(firstVar.createdAt);
			//count time between two records,
		 followingVar = BertStatus.findOne( 
			{ bertStatus: 0 }, 
			{ sort: { createdAt: -1 } }, 
			{ set: { idInc: i + 1 } } 
			);
		 followingVarTime = Date.parse(followingVar.createdAt);
//doesnt work yet...
		 	if(firstVar.bertStatus == 1){//OUT
		 		var timeOutsideTotalVar = InOutDurationDB.find().timeOutsideTotal
		 		var timeOutside = followingVarTime - firstVarTime // TIME OUTSIDE
		 		InOutDurationDB.insert({
		 			timeOutsideTotal: timeOutside + timeOutsideTotalVar
		 		});
		 	}

		 	else if(firstVar.bertStatus == 0){
		 		var timeInsideTotalVar = InOutDurationDB.find().timeInsideTotal
		 		var timeInside = followingVarTime - firstVarTime  // TIME INSIDE
		 		InOutDurationDB.insert({
		 			timeInsideTotal: timeInside + timeInsideTotalVar
		 		});
		 	}


		}
	});











	}));