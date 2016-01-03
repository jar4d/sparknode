BertStatus = new Mongo.Collection('bertStatus');
InOutDurationDB = new Mongo.Collection('inOutDurationDB');

// Global router config
Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'layoutTemplate'

});

Router.route('settings', {
	template: 'home',
	waitOn: function(){
		Meteor.subscribe('bertStatus');
		Meteor.subscribe('inOutDurationDB');
  },
  data: function(){
  		 if(this.ready()) return BertStatus.find(); return InOutDurationDB.find();	
  }
});

Router.route('/', {
  template: 'dash',
  waitOn: function(){
    Meteor.subscribe('bertStatus');
    Meteor.subscribe('inOutDurationDB');
  },
  data: function(){
       if(this.ready()) return BertStatus.find(); return InOutDurationDB.find();  
  }


});