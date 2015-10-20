$(document).ready(function(){
    // Left Side
     $("#left-panel").mouseover(
         function(){
             // Background
             $("#left-background").addClass("active-left").removeClass("inactive-left");
             
             // Divider 
             $("#divider-panel").addClass("divider-active-left").removeClass("divider-inactive");
             
             $("#left-panel").addClass("active-text").removeClass("inactive-text-left");
             $("#right-panel").addClass("hide-text").removeClass("inactive-text-right");
             
     }).mouseout(
         function(){
             // Background
            $("#left-background").removeClass("active-left");
            $("#left-background").addClass("inactive-left");
            
            // Divider
             $("#divider-panel").addClass("divider-inactive");
             $("#divider-panel").removeClass("divider-active-left");
             
             $("#left-panel").removeClass("active-text").addClass("inactive-text-left");
             $("#right-panel").removeClass("hide-text").addClass("inactive-text-right");
             
     });
    
    // Right Side
     $("#right-panel").mouseover(
         function(){
             // Background
             $("#right-background").addClass("active-right");
             $("#right-background").removeClass("inactive-right");
             
             // Divider 
             $("#divider-panel").addClass("divider-active-right");
             $("#divider-panel").removeClass("divider-inactive");
             
             $("#right-panel").addClass("active-text").removeClass("inactive-text-right");
             $("#left-panel").addClass("hide-text").removeClass("inactive-text-left");
    }).mouseout(
        function(){
            // Background
            $("#right-background").removeClass("active-right").addClass("inactive-right");
            
            // Divider
             $("#divider-panel").addClass("divider-inactive").removeClass("divider-active-right");
             
             $("#right-panel").removeClass("active-text").addClass("inactive-text-right");
             $("#left-panel").removeClass("hide-text").addClass("inactive-text-left");
    });
    
    
    $("#menuButton").click(function() {
        $("#menu-overlay").addClass("menu-overlay-active").removeClass("menu-overlay-inactive");
    })
});