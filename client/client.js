Template.bertStatusTemplate.helpers({
	'status': function(){
		return BertStatus.findOne(
			{}, {sort: {createdAt: -1} }
		);
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
    //status = BertStatus.find().fetch();
    var totalInOutRecords = BertStatus.find({}).count();
    var inTotal = BertStatus.find({ bertStatus: 0 }).count();
    var outTotal = BertStatus.find({ bertStatus: 1 }).count();
    console.log('Total:' + totalInOutRecords)
    console.log('inTotal:' + inTotal)
    console.log('outTotal:' + outTotal)


	


	
	return{
		data: {
			//columns: [inTotal, outTotal],
			columns: [['data1',inTotal], ['data2',outTotal]],
			type: 'donut'
		},
	    donut: {
        	title: "Time spent.."
    }
	}





}	
});

