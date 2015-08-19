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

var core = new spark.Core({accessToken:'88d7dd2b3dcc7c3453532454677a76f717830f69',id:'40003c000c47343432313031'});

//CORE EVENT SYNTAX: core.on(eventName, function handler(eventData) {/*do something;*/});
//Watches for an event, logs numerically into database. Wraps as an Async function.
core.on('bertStatus', Meteor.bindEnvironment(function handler(eventData) {
	//console.log(eventData);
	console.log("logging bertStatus event data..");
	bertStatusString = eventData.data;
	if (bertStatusString == 'I\'m out!'){
    	
    	currentIdInc = BertStatus.findOne({},{sort:{idInc:-1}}).idInc || 1;

			BertStatus.insert({
              bertStatus: 0,
              bertStatusString: 'I\'m in!',
              startEnd:"End",
              createdAt: new Date(),
              idInc: currentIdInc + 1
              });

			BertStatus.insert({
              bertStatus: 1,
              bertStatusString: 'I\'m out!',
              startEnd:"Start",
              createdAt: new Date(),
              idInc: currentIdInc + 2
              });


	}
	else if (bertStatusString == 'I\'m in!'){
		//bertStatus = 0

    	currentIdInc = BertStatus.findOne({},{sort:{idInc:-1}}).idInc || 1;

			BertStatus.insert({
              bertStatus: 1,
              bertStatusString: 'I\'m out!',
              startEnd:"End",
              createdAt: new Date(),
              idInc: currentIdInc + 1
              });

			BertStatus.insert({
              bertStatus: 0,
              bertStatusString: 'I\'m in!',
              startEnd:"Start",
              createdAt: new Date(),
              idInc: currentIdInc + 2
              });

	}



     var sum=0;
     var cursor=BertStatus.find({bertStatus: 1, startEnd:"Start"});
     cursor.forEach(function(createdAt){
       sum = sum + createdAt
     });
     return sum;


	//update calculation for the time bert is IN and OUT. REMEBER 1 is OUT.
	//increment through records
	    
	    //calculate total OUT time:
	    var totalInOutRecords = BertStatus.find({}).count();
		for (var i = 0; i < totalInOutRecords; i++) {
		
		 timeOutsideStartVar = BertStatus.findOne( 
			{ bertStatus: 1 }, 
			{ sort: { createdAt: -1 } }, 
			{ set: { idInc: i } } 
			);
		timeOutsideStart = Date.parse(timeOutsideStartVar.createdAt);
			//count time between two records,
		 timeOutsideEndVar = BertStatus.findOne( 
			{ bertStatus: 1 }, 
			{ sort: { createdAt: -1 } }, 
			{ set: { idInc: i + 1 } } 
			);
		 timeOutsideEnd = Date.parse(timeOutsideEndVar.createdAt);
//doesnt work yet...

		 		var timeOutsideTotalVar = InOutDurationDB.find().timeOutsideTotal
		 		var timeOutsidePeriodTotal = timeOutsideEnd - timeOutsideStart // TIME OUTSIDE
		 		InOutDurationDB.insert({
		 			timeOutsideTotal: timeOutsidePeriodTotal + timeOutsideTotalVar
		 		});
		 	
		 		console.log(timeOutsideTotalVar)

		 	}


		












	}));