Meteor.startup(function(){
	startDate = new Date();

	if(BertStatus.find().count() == 0){
			BertStatus.insert({
				bertStatus: 0,
              	bertStatusString: 'I\'m in!',
              	startEnd:"Start",
				createdAt: new Date(),//hacky - this needs to change!
				idInc: 0
			});

	}
	 if(InOutDurationDB.find().count() == 0){
		InOutDurationDB.insert({
				     	inTotal: 1 - startDate,
				     	outTotal: 1 - startDate
				     });

	}

});
		     

Meteor.publish('bertStatus', function(){
	return BertStatus.find();
});

Meteor.publish('inOutDurationDB', function(){
	return InOutDurationDB.find();
});

var spark = Meteor.npmRequire('sparknode');

var core = new spark.Core({accessToken:'d12e23f44cbb73dbb07b7e3f97e0f611d4d67334',id:'40003c000c47343432313031'});

//CORE EVENT SYNTAX: core.on(eventName, function handler(eventData) {/*do something;*/});
//Watches for an event, logs numerically into database. Wraps as an Async function.
core.on('bertStatus', Meteor.bindEnvironment(function handler(eventData) {
	//console.log(eventData);
	console.log("logging bertStatus event data..");
	bertStatusString = eventData.data;
	if (bertStatusString == 'I\'m out!'){
    	
    	currentIdInc = BertStatus.findOne({},{sort:{idInc:-1}}).idInc || 1;

    		//Add END/IN tag
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

			//Recalculate IN total
		     var inStartTotal=0;
		     var cursor=BertStatus.find({bertStatus: 1, startEnd:"Start"});
		     cursor.forEach(function(row){
		     	var inStartPeriod = Date.parse(row.createdAt);
		     	inStartTotal = inStartTotal + inStartPeriod;

		     });
 			     var inEndTotal=0;
		     var cursor=BertStatus.find({bertStatus: 1, startEnd:"End"});
		     cursor.forEach(function(row){
		     	var inEndPeriod = Date.parse(row.createdAt);
		     	inEndTotal = (inEndTotal + inEndPeriod);
		     	console.log("inEndTotal: " + inEndTotal) //this INENDTOTAL number is too small???
		     });
		     inTotalResult = Math.abs(inEndTotal - inStartTotal);
		     	console.log("in total: " + inEndTotal)
		     	console.log(" - " + inStartTotal)
		     	console.log( " = " + inTotalResult)
		     var outTotal = InOutDurationDB.findOne().outTotal
		     InOutDurationDB.update({},
		     	{
		     		inTotal: inTotalResult,
		     		outTotal:outTotal
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


			//Recalculate OUT total
		     var outStartTotal=0;
		     var cursor=BertStatus.find({bertStatus: 0, startEnd:"Start"});
		     cursor.forEach(function(row){
		     	var outStartPeriod = Date.parse(row.createdAt);
		     	outStartTotal = outStartTotal + outStartPeriod;

		     });
 			     var outEndTotal=0;
		     var cursor=BertStatus.find({bertStatus: 0, startEnd:"End"});
		     cursor.forEach(function(row){
		     	var outEndPeriod = Date.parse(row.createdAt);
		     	outEndTotal = outEndTotal + outEndPeriod;
		     });
		     outTotalResult = Math.abs(outEndTotal - outStartTotal);
		     console.log("out total: " + outEndTotal)
		     console.log(" - " + outStartTotal)
		     console.log( " = " + outTotalResult)
		     var inTotal = InOutDurationDB.findOne().inTotal
		     InOutDurationDB.update({},
		     	{
		     	outTotal: outTotalResult,
		     	inTotal: inTotal
		     	});



























	}


	}));