function Spidy() {
	var scrapy = require('node-scrapy')

	function crawlShows(){
	  // var url = 'http://www.uktw.co.uk/London/Adelphi-Theatre/V379/'
	  var url = 'http://www.uktw.co.uk/town/London/'
	  var links =
	      { showLinks: 
	        { selector: '.uk-small-1-3:nth-child(1) div.long div.uk-panel a',
	          get: 'href' } }

	  var show =
	      { name: 'h1.uk-panel-title',
	        theatre: '[itemtype=\'http://data-vocabulary.org/Breadcrumb\']:last-child [itemprop=\'title\']',
	        theatreSourceLink: 
	        { selector: '[itemtype=\'http://data-vocabulary.org/Breadcrumb\']:last-child [itemprop=\'url\']',
	          get: 'href' },
	        from: '.dtstart',
	        to: '.dtend' }

	  scrapy.scrape(url, links, function(err, data) {
	      if (err) return console.error(err)
	      console.log('Crawled show links...')

	      data.showLinks.forEach(function(link){
	          scrapy.scrape(link, show, function(err, data) {
	            if (err) return console.error(err);

            	data.sourceLink = link;

	            console.log('Crawled ' + data.name);
	            console.log(data);
	          });
	      });
	  });

	}

	this.getShows = function(){
		return crawlShows();
	}

}

module.exports = Spidy;