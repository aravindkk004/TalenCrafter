$(document).ready(function(){
    var skills = [];

    //for adding item
    $(".addbtn").click(()=>{
        var match=false;
        const value = $("#skilloptions").val();

        skills.forEach((skill)=>{
            if(value==skill){
                match=true;
            }
        })
        if(!match){
            var newSkill = $(`<div class="skill1"><p class="skill">`+value+`</p><span class="material-symbols-outlined closebtn" id="closebtn">
            close
            </span>
            </div>`);

            skills.push(value)
            const afterits = skills.join(',');
            $(".hiddeninp").val(JSON.stringify(skills));

            $(".skillopt").append(newSkill);
        }
    })

    //for removing item
    $(".skillopt").on("click", ".closebtn", function () {
        console.log($(this));
        var removedSkill = $(this).siblings(".skill").text();
        skills = skills.filter((skill) => skill !== removedSkill);

        $(".hiddeninp").val(JSON.stringify(skills));

        $(this).parent().remove();
    });
});