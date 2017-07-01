function Spidy() {
	var scrapy = require('node-scrapy')

	function crawlShows(){
	  var url = 'http://www.officiallondontheatre.co.uk/london-shows/venue/?portal:componentId=9753&amp;portal:type=action&amp;portal:isSecure=false&amp;portal:portletMode=view&amp;pageNo=4#/?rows=10&q=&sort=title_for_sorting_sortable%20asc'
	  var links =
	      { showLinks: 
	        { selector: '.linkedShowsContainer a',
	          get: 'href' } }

	  var show =
	      { name: 'h1.uk-panel-title',
	        theatre: '[itemtype=\'http://data-vocabulary.org/Breadcrumb\']:last-child [itemprop=\'title\']',
	        theatreSourceLink: 
	        { selector: '[itemtype=\'http://data-vocabulary.org/Breadcrumb\']:last-child [itemprop=\'url\']',
	          get: 'href' },
	        from: '.dtstart',
	        to: '.dtend' }

	  scrapy.scrape(url, links, { requestOptions: }, function(err, data) {
    	if (err) return console.error(err)
	    console.log('Crawled show links...')
		console.log(data);

	  //     data.showLinks.forEach(function(link){
	  //         scrapy.scrape(link, show, function(err, data) {
	  //           if (err) return console.error(err);

   //          	data.sourceLink = link;

	  //           console.log('Crawled ' + data.name);
	  //           console.log(data);
	  //         });
	  //     });
	  });

	}

	this.getShows = function(){
		return crawlShows();
	}

}

module.exports = Spidy;