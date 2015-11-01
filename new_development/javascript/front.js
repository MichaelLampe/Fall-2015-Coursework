jQuery.fn.slowMove = function(){
    var target= this.attr('href');
    this.on('click', function(e){
        e.preventDefault();
        $('html, body').stop().animate({
           scrollTop: $(target).offset().top
        }, 1000);
    });
};

jQuery.fn.verticalAlign = function (){
    return this
            .css("margin-top",($(this).parent().height() - $(this).height())/2 + 'px' )
};

$('#learn-more').slowMove();

$('.bubble-text').verticalAlign();