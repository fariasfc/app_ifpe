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
    
    
        /* button  Button */
    $(document).on("click", ".uib_w_22", function(evt)
    {
         /*global activate_subpage */
         activate_subpage("#test_subpage"); 
         return false;
    });
    
        /* button  #btn_go_feed */
    $(document).on("click", "#btn_go_feed", function(evt)
    {
         /*global activate_page */
         activate_page("#feed_news"); 
         return false;
    });
    
        /* button  #btn_back */
    $(document).on("click", "#btn_back", function(evt)
    {
        $('#detail_post').addClass('hidden');

        /* your code goes here */ 
         return false;
    });
    
        /* button  #btn_feed */
    $(document).on("click", "#btn_feed", function(evt)
    {
         /*global activate_page */
         activate_page("#feed_news"); 
         return false;
    });
    
        /* button  Button */
    $(document).on("click", ".uib_w_35", function(evt)
    {
         /*global activate_page */
         activate_page("#mainpage"); 
         return false;
    });
    
        /* button  #btn_back */
    $(document).on("click", "#btn_back", function(evt)
    {
         /*global activate_page */
         activate_page("#mainpage"); 
         return false;
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
