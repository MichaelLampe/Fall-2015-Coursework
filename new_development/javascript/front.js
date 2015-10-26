function slowMove(input){
    var selectedItem = $(input);
    selectedItem.on('click', function(e){
    e.preventDefault();
    var target= selectedItem.attr('href');
    $('html, body').stop().animate({
       scrollTop: $(target).offset().top
    }, 1000);
});
}

slowMove('#learn-more');