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
            var newSkill = $(`<div class="skill1"><p class="skill">`+value+`</p><span class="material-symbols-outlined" id="closebtn">
            close
            </span>
            </div>`);

            skills.push(value);

            $(".hiddeninp").val(JSON.stringify(skills));

            $(".skillopt").append(newSkill);
        }
    })

    //for deleting a item
    var deleteItem = []; 
    for (var i=0; i<document.querySelectorAll('.skill1').length; i++){
        document.querySelectorAll('.skill1')[i].addEventListener('click', function(){
            console.log("clicked");
            var child = this.firstElementChild.textContent;
            console.log(child);
            var deleted = this.remove();
            deleteItem.push(child);

            $(".hiddendelete").val(JSON.stringify(deleteItem));
        });
    };

    // for domain
    var domains=[]; 
    $(".addbtnDomain").click(()=>{
        var matchDom = false;
        const domainvalue = $("#domainOptions").val();

        domains.forEach((domain)=>{
            if(domainvalue==domain){
                matchDom=true;
            }
        })
        if(!matchDom){
            var newDomain = $(`<div class="domain1"><p class="domain">`+domainvalue+`</p><span class="material-symbols-outlined" id="closebtn">
            close
            </span>
            </div>`);

            domains.push(domainvalue);

            $(".hiddeninpdom").val(JSON.stringify(domains));

            $(".domainopt").append(newDomain);
        }
    })

    //for deleting a domain
    var deletedomItem = [];
    for (var i=0; i<document.querySelectorAll('.domain1').length; i++){
        document.querySelectorAll('.domain1')[i].addEventListener('click', function(){
            var child = this.firstElementChild.textContent;
            var deleted = this.remove();
            deletedomItem.push(child);

            $(".hiddendeletedom").val(JSON.stringify(deletedomItem));
        });
    };
})