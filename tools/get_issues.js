var clawer_aggregate = require('clawer_aggregate');
var _ = require('underscore');

clawer_aggregate({

})
.grep('https://github.com/fxsjy/jieba/issues?utf8=%E2%9C%93&q=',{
  max : ['text','#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div > div.paginate-container > div > a:nth-child(9)']
})
.custom(function( res, done ) {
  var res = res[0];

  var all = _.range(1, res.max * 1 +1 ).map(function( num ) {
    return {
      url : res.url,
      page : 'https://github.com/fxsjy/jieba/issues?page='+ num +'&q=&utf8=%E2%9C%93'
    }
  });

  return all;
})
.grep('$page',{
  $context : '#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div > div.border-right.border-bottom.border-left > ul > li',
  title : ['text','div > div.float-left.col-9.p-2.lh-condensed > a'],
  is_close : ['attr:aria-label','div > div.float-left.pt-2.pl-3 > span'],
  replys : ['text', 'div > div.float-right.col-2 > div.float-right.col-5.no-wrap.pt-2.pr-3.text-right > a > span']
})
.each(function( res ) {
  res.title = res.title.trim();
  var content = res.is_close.split(' ');
  res.is_close = content[0] == 'Closed';
  res.type = content[1];
  res.replys = (res.replys || 0) *1;

  res.good = res.replys > 0 && res.is_close;
})
.filter(function( res ) {
  return res.type == 'issue';
})
.exec(function(err, res) {
  if( res ){
    res.forEach(function( res ) {
      console.log( res.is_close,  res.replys, res.type, res.title );
    });
  }
});