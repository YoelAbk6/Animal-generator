$(document).ready(function(){
    getDate();
    let animalsData;
    $(".option").click(function(){
        let number = $(this).text();
        let dataUrl = "https://zoo-animal-api.herokuapp.com/animals/rand/"+number

        //The ajax call to the herkoupp that retirives the animals data
        $.ajax({
            type: 'GET', 
            url: dataUrl,
            dataType: 'json',
            success: function(res){
                animalsData = res;
                createGrid(animalsData);
                $(".photoContainer").on('click', '.photo', function(){
                    createDialog(animalsData[this.id]);
                })
            },

            error: function(xhr, errorMessage){
                $(".photoContainer").html(`<h1 class = 'notFound'>Oops<h1/><h2 class = 'notFound'>${xhr.responseText}<h2/>`)
                console.log("Error: " + errorMessage);
            }
        })
    })
})

//Creates the dialog box with the 'animal' data
function createDialog(animal){
    swal({
        title: `${animal.name}`,
        text: `Family: ${animal.animal_type ? animal.animal_type : ""}
        Diet: ${animal.diet ? animal.diet : ""}
        Life span: ${animal.lifespan ? animal.lifespan : ""} Years
        Min length: ${animal.length_min ? (parseFloat(animal.length_min) * 0.3048).toFixed(3) : ""}m
        Max length: ${animal.length_max ? (parseFloat(animal.length_max) * 0.3048).toFixed(3) : ""}m
        Min Weight: ${animal.weight_min ? (parseFloat(animal.weight_min) * 0.4535927).toFixed(3) : ""}Kg
        Max Weight: ${animal.weight_max ? (parseFloat(animal.weight_max) * 0.4535927).toFixed(3) : ""}Kg
        Weekly views: `+getWeeklyViwes(animal.name)
    })
}


//Performs the ajax call to get the weekly views
function getWeeklyViwes(animal_name){

    //Gets the current date
    let today = new Date;
    //arange it in the right format
    let today_formated = ""+today.getFullYear()+('0'+(today.getMonth()+1)).slice(-2)+('0'+today.getDate()).slice(-2);
    
    //Get the date a week back from now, 7 days ago, 24 hrs ext.
    let last_week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    let last_week_fomated = ""+last_week.getFullYear()+('0'+(last_week.getMonth()+1)).slice(-2)+('0'+last_week.getDate()).slice(-2);
    let req_url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${animal_name}/daily/${last_week_fomated}/${today_formated}`;
    
    let tot_views = 0;
    $.ajax({
        type: 'GET', 
        url: req_url,
        dataType: 'json',
        async :false,
        success: function(res){
            //sums the views
            res["items"].forEach(element => {
                tot_views += parseInt((element.views || 0));
            });
        },
        error: function(xhr){
            console.log(xhr.status + ': ' + xhr.statusText)
            tot_views = ""
        }
    })
    return tot_views;
}

//Creates the photogrid
function createGrid(animalsData){
    $(".photoContainer").html("<table class='table table-image'><tbody id='photoGrid'>  </tbody></table>");
    
    let i, row;
    
    //Creates the table grid, in tuples
    for(i=0; i<animalsData.length; i+=2){
        row = `<tr>
        <td class = 'photoName' id = photoName${i}>${animalsData[i].name}</td>
        <td class = 'photoName' id = photoName${i+1}>${animalsData[i+1].name}</td>
        </tr>
        <tr>
        <td><img class = 'photo' id = ${i} src = ${animalsData[i].image_link} width = 200px height = 150px></td>               
        <td><img class = 'photo' id = ${i+1} src = ${animalsData[i+1].image_link} width = 200px height = 150px></td>
        </tr> `
        $("#photoGrid").append(row);
    }
}

//Makes the ajax call to the php file in order to get the current date
function getDate() {
    $.ajax({
        url: 'sources/get_current_date.php',
        type: 'GET',
        datatype: 'html',
        success: function (response) {
            $("#date").html(response);
        },
        error: function (errorMessage) {
            $("#date").text("Ajax date call failed");
            console.log("Error: " + errorMessage);
        }

    });
}