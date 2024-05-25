$(document).ready(function(){
    $('.readmore').click(function() {
        var clickedClassName = $(this).attr('id');
        $("#popup").addClass("active");
        $(".offers").addClass("pop-active");
        $("body").addClass("open-popup");
        if(clickedClassName == "resume") {
            $(".popupname").html("Resume Builder");
            $(".popupcontent").html("Experience seamless resume creation with TalenCrafter's AI-powered Resume Builder. Simply enter your desired job position, and our advanced AI will craft a tailored resume, optimizing it for the role's requirements. Save time, ensure job-specific relevance, and effortlessly present your skills and experiences. Empower your job search with a standout resume, making your professional journey smoother and more successful.");
        } else if(clickedClassName == "alert") {
            $(".popupname").html("Job Alert");
            $(".popupcontent").html("Explore career opportunities effortlessly with TalenCrafter's Discover Jobs feature. Tailored to your skills, this intuitive tool helps you find the perfect job match. Apply seamlessly, track your applications, and stay informed about the hiring process. Receive instant notifications via email when you land that dream job. TalenCrafter empowers your job search, ensuring a smooth and responsive experience from discovery to success.");
        } else if(clickedClassName == "discovery") {
            $(".popupname").html("Discover jobs");
            $(".popupcontent").html("Stay ahead in your job search with TalenCrafter's Job Alert feature. Set personalized alerts for application deadlines, and receive timely notifications via email. Never miss an opportunity as our system keeps you informed when the application deadline is approaching. TalenCrafter is your proactive companion, ensuring you're always in the loop for potential career advancements.");
        }
    });
    $("#close").click(function() {
    $("#popup").removeClass("active");
    $(".offers").removeClass("pop-active")
    $("body").removeClass("open-popup")
    });
});


