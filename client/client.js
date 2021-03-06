Meteor.startup(function(){
	startDate = new Date();
});

  Template.dashTemplate.helpers({
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
      var minutes = minutes < 10 ? "" + minutes : minutes;
      Session.set('minutes',minutes);
      var seconds = seconds < 10 ? "" + seconds : seconds;
      Session.set('seconds',minutes);

      return minutes + " minutes and " + seconds +" seconds"
},

'inOutDonutChartPlot': function(){
  var total = InOutDurationDB.findOne();
  var inTotal = total.inTotal
  //var inTotalHours = intotal.getHours();
  var outTotal = total.outTotal

    Session.set( 'inTotal', total.inTotal );
    Session.set( 'outTotal', total.outTotal );
    
    //Session.set( 'inTotal', 10 );
   // Session.set( 'outTotal', 162000 );
  
  return{
    data: {
          columns: [ ['Time inside', Session.get('inTotal')],['Time outside', Session.get('outTotal')] ],
      type: 'donut',
          colors: {
            'Time inside': '#2A1C8C',
            'Time outside': '#16D99B'
        },
      },

      donut: {
    }
}
}
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
      var minutes = minutes < 10 ? "" + minutes : minutes;
      Session.set('minutes',minutes);
      var seconds = seconds < 10 ? "" + seconds : seconds;
      Session.set('seconds',minutes);

      return minutes + " minutes and " + seconds +" seconds"
}
});

//realtime graphs
Template.charts.helpers({
'inOutLineChartPlot': function(){
    var BertStatusVar = BertStatus.find().fetch();

        return{
          data: {
            type:'area',
            colors:{
            	'bertStatus': '#16D99B'
            },
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
              y:{
              	//max:2,
              	min:0,
              	tick: {
              		//count: 0,
                    format: function (d) { 
                    	if(d == 0){
                    		return "Inside"
                    	}
                    	if(d == 1){
                    		return "Outside"
                    	}
              		}
              }
        }
      }
    }

},


'inOutDonutChartPlot': function(){
	var total = InOutDurationDB.findOne();
	var inTotal = total.inTotal
	//var inTotalHours = intotal.getHours();
	var outTotal = total.outTotal

    Session.set( 'inTotal', total.inTotal );
    Session.set( 'outTotal', total.outTotal );
    
    //Session.set( 'inTotal', 10 );
   // Session.set( 'outTotal', 162000 );
	
	return{
		data: {
	        columns: [ ['Time inside', Session.get('inTotal')],['Time outside', Session.get('outTotal')] ],
			type: 'donut',
	        colors: {
            'Time inside': '#2A1C8C',
            'Time outside': '#16D99B'
        },
			},

	    donut: {
		}
}
},

'weightChartPlot': function(){
        return{
          data: {
            type:'area',
            colors:{
            	'Weight': '#16D99B'
            },
            json: {
            	Weight: [4.5, 4.2, 4.1, 4, 4.3, 4.6, 4.8],
            	Food: [0.5, 0.3, 0.3, 0.3, 0.4, 0.5, 0.6]
            }
          }
      }
    }	



});

