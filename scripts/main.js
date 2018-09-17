$(document).ready(function(){
   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCxMEpM2VVSBk17TUEbcITBbqmzsKMapKQ",
    authDomain: "train-schedule-8dc1d.firebaseapp.com",
    databaseURL: "https://train-schedule-8dc1d.firebaseio.com",
    projectId: "train-schedule-8dc1d",
    storageBucket: "train-schedule-8dc1d.appspot.com",
    messagingSenderId: "1038420127956"
  };
  firebase.initializeApp(config);

    
    


    
    const database = firebase.database();

    
    const currentTime = moment();
    let firstTrain = '';
    let freq = 0;
    let arrivalTime = 0;
    let waitTime = 0;
    let train;
    let first;
    let destination;
    let frequency;

  
  const texasCities = ["abilene", "allen", "amarillo", "arlington", "atascocita", "austin", "baytown", "beaumont","brownsville", "bryan", "carrollton", "cedar park","college station", "conroe", "corpus christi", "dallas", "denton", "desoto", "edinburg", "el paso", "euless", "fort worth", "galveston", "garland", "georgetown", "grand prairie", ,  "grapevine", "harlingen",  "houston", "irving", "katy", "killeen", "laredo", "league city", "longview", "lubbock", "mansfield", "mcallen", "mckinney", "mesquite", "midland", "mission",  "missouri city", "new braunfels", "odessa", "pasadena", "pflugerville", "plano",  "port arthur", "richardson", "round rock", "san angelo", "san antonio", "san marcos", "spring", "sugar land", "temple", "tyler", "victoria", "waco", "wichita falls"];
  

    database.ref().orderByChild("destination").on("child_added", function(childsnap){
      const cs = childsnap.val();
    
      freq = cs.frequency;
      firstTrain = cs.first;
      
  
      let firstTimeStatic = moment(firstTrain, "HHmm").subtract(1, "years");
     
      let diffTime = moment().diff(moment(firstTimeStatic),"minutes");
      let remainder = diffTime % freq;
      waitTime = freq - remainder;
      arrivalTime = moment().add(waitTime, "minutes");

      $("tbody").append(`
        <tr class="trainRow">
          <td class="titleCase">${childsnap.val().train}</td>
          <td class="titleCase">${childsnap.val().destination}</td>
          <td>${freq}</td>
          <td>${moment(arrivalTime).format("HH:mm")}</td>
          <td class="waitTime">${waitTime} minutes</td>
        </tr>
      `);
      console.log();
    });
  $("tbody").on("click",".trainRow", function(){
    console.log(this);
  });
  database.ref().on("child_removed", function(snapshot) {
    var deletedPost = snapshot.val();
    console.log("The blog post titled '" + deletedPost.title + "' has been deleted");
  });
  
  console.log(currentTime);
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  

  $("#submit").click((e)=>{
    e.preventDefault();
    
    train = $("#train").val().trim();
    first = $("#first").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();

    
    if( !(/^([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test($("#first").val().trim())) ){
      alert('Please use the military time format: hhmm.');
    }
     
    else if ( ($("#train").val().trim()== '') || ($("#train").val().trim()== null) || ($("#destination").val().trim()== '') || ($("#destination").val().trim()== null) || ($("#frequency").val().trim()== '') || ($("#frequency").val().trim()== null) ){
      alert('No empty values, please.');
    }
     
    else if(texasCities.indexOf(destination.toLowerCase())==-1){
      alert('That city is not serviced on this train system. Please choose another nearby city.');
    }
    else{
      const formData = {
        train,
        first,
        destination,
        frequency
      }
      console.log(`train line: ${formData.train}`);
      console.log(`first train departs at: ${formData.first}`);
      console.log(`frequency of train: ${formData.frequency}`);
      database.ref().push(formData);
     
      $('input').val('');
      console.log(formData);
    }
  });

    $("#cancel").click(()=>{
    $("#train").val('');
    $("#first").val('');
    $("#destination").val('');
    $("#frequency").val('');
  });

  });