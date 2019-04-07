// add to table with new informations submitted
function addToTable(trainName, destination, firstTrain, frequency, key) {
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // create new row to table and insert the new information
    var newrow = $("<tr>").addClass("rowCount");
    newrow.append($("<td>" + trainName + "</td>"));
    newrow.append($("<td>" + destination + "</td>"));
    newrow.append($("<td>" + frequency + "</td>"));
    newrow.append($("<td>" + moment(nextTrain).format("hh:mm A") + "</td>"));
    newrow.append($("<td>" + tMinutesTillTrain + "</td>"));
    newrow.append($("<td><button class='delete'data-key='" + key + "'>X</button></td>"));
    $("#table").prepend(newrow);
}

var database = firebase.database();
$(document).ready(function () {

    // when submit button is clicked,
    $("#submitButton").on("click", function (event) {

        // check that there is input on all the input sections
        if ($("#InputTrainName").val().trim() === "" ||
            $("#InputDestination").val().trim() === "" ||
            $("#InputFirstTrainTime").val().trim() === "" ||
            $("#InputFrequency").val().trim() === "") {

            // alert user if any of inputs are incomplete
            alert("Please fill in all details to add new train");

            // else push inputs to database and empty out the inputs
        } else {
            event.preventDefault();
            var trainName = $("#InputTrainName").val().trim();
            var destination = $("#InputDestination").val().trim();
            var firstTrain = $("#InputFirstTrainTime").val().trim();
            var frequency = $("#InputFrequency").val().trim();

            database.ref().push({
                trainName: trainName,
                destination: destination,
                firstTrain: firstTrain,
                frequency: frequency
            });
            $(".form-control").val('');
        }
    });

    // when children is added to database
    database.ref().on("child_added", function (childSnapshot) {

        // get info from database
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        var frequency = childSnapshot.val().frequency;
        var key = childSnapshot.key;

        // pass if to add to table and call the function
        addToTable(trainName, destination, firstTrain, frequency, key);

        // console log if there's any error
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // when x button is clicked ,it is removed from the database and webpage is reloaded
    $(document).on("click", ".delete", function () {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();
    });
    
    // webpage is reloaded every minutes
    setInterval(function () {
        window.location.reload();
    }, 60000);

});