/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  #btn_go_feed */
    
    
        /* button  #btn_go_feed */
    
    
        /* button  #btn_go_feed */
    
    
        /* button  Button */
    
    
        /* button  Button */
    
    
        /* button  #btn_go_feed */
     
    
        /* button  #btn_home */
    
    
        /* button  #btn_home */
    $(document).on("click", "#btn_home", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#page_16_89"); 
         return false;
    });
    
        /* button  #btn_config */
    $(document).on("click", "#btn_config", function(evt)
    {
         /*global activate_page */
         activate_page("#user_detail"); 
         return false;
    });
    
        /* button  #btn_feed */
    
    
        /* button  #btn_feed */
    $(document).on("click", "#btn_feed", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#page_16_89"); 
         return false;
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
