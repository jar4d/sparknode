Meteor.startup(function(){
	startDate = new Date();
});



	Template.bertStatusTemplate.helpers({
	'statusText': function(){
		var bertStatusVar = BertStatus.findOne({}, {sort: {createdAt: -1} });

		if(bertStatusVar.bertStatus == 0){
			return "Bert has been inside for "
		}
		if(bertStatusVar.bertStatus == 1){
			return "Bert has been outside for "
		}
	},
	'statusIcon': function(){
		var bertStatusVar = BertStatus.findOne({}, {sort: {createdAt: -1} });

		if(bertStatusVar.bertStatus == 0){
			return "fa fa-home"
		}
		if(bertStatusVar.bertStatus == 1){
			return "fa fa-tree"
		}
	},

 	'counter': function(){
		var bertStatusVar = BertStatus.findOne({}, {sort: {createdAt: -1} });
		var timeSince = Date.parse(bertStatusVar.createdAt);
	  	Session.set('now', Math.floor((TimeSync.serverTime() - timeSince)/1000));
	  	now =  Session.get('now');

      var minutes = Math.floor(now / 60);
      var seconds = Math.floor(now % 60); // that % is modulo, the remainter when totaltime / 60...
      var minutes = minutes < 10 ? "0" + minutes : minutes;
      Session.set('minutes',minutes);
      var seconds = seconds < 10 ? "0" + seconds : seconds;
      Session.set('seconds',minutes);

      return minutes + " minutes and " + seconds +" seconds"
}
});

//realtime graphs
Template.charts.helpers({
'lineChartPlot': function(){
    var BertStatusVar = BertStatus.find().fetch();

        return{
          data: {
            json: BertStatusVar,
            keys: {
            value: ['bertStatus'],
            x: 'createdAt'
            }
          },
          axis:{
              x:{
                  type: 'timeseries',
                  tick: { format: '%H:%M' }
                }, 
          type: 'area'                 
        }
      };
    },

'donutChartPlot': function(){
	var total = InOutDurationDB.findOne();
	var inTotal = total.inTotal
	//var inTotalHours = intotal.getHours();
	//var outTotal = total.outTotal.getHours();

    Session.set( 'inTotal', total.inTotal );
    Session.set( 'outTotal', total.outTotal );
    
    //Session.set( 'inTotal', 10 );
   // Session.set( 'outTotal', 162000 );
	
	return{
		data: {
	        columns: [ ['Time inside', Session.get('inTotal')],['Time outside', Session.get('outTotal')] ],
			type: 'donut'
			},
	  	color: {
		    pattern: ['#AACCB1', '#D4D6D9']
			  },
	    donut: {
			    label: {
			      format: function (value) { return value; }
			    }
		}





}	
}
});

