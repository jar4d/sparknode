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
		     var cursor=BertStatus.find({bertStatus: 1, startEnd:"Start"}).fetch();
		     cursor.forEach(function(createdAt){
		     var inStartTotal = inStartTotal + Date.parse(createdAt);
		     });
		     var inEndTotal=0;
		     var cursor=BertStatus.find({bertStatus: 1, startEnd:"End"}).fetch();
		     cursor.forEach(function(createdAt){
		     var inEndTotal = inEndTotal + Date.parse(createdAt);
		     });
		     inTotal = inEndTotal - inStartTotal
		     //return inTotal;
		     console.log("in total: " + inTotal)

		     console.log("furp")




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
		     var outStartTotal = outStartTotal + Date.parse(row.createdAt);
		     });
		     var outEndTotal=0;
		     var cursor=BertStatus.find({bertStatus: 0, startEnd:"End"});
		     cursor.forEach(function(row){
		     var outEndTotal = outEndTotal + Date.parse(row.createdAt);
		     });
		     outTotal = outEndTotal - outStartTotal
		     //return outTotal;
		     console.log("out total: " + outTotal)
		     console.log("furp")

	}








		












	}));