$(document).ready(function () {
    var eventForm = $("#eventform");
    var inputBand = $("#inputBand");
    var inputLocation = $("#inputLocation");
    var inputDescription = $("#description");
    var inputDate = $("#date");
    var inputGenre = $("#category");
    var eventArea = $("#event-list");
    const genreSelection = $("#exampleFormControlSelect1")
    let userId;

    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.email);
        userId = data.id;
        console.log(userId);
      });



    $(document).on("click", "button.delete", deleteEvent);
    genreSelection.on("change", pop)

    function pop() {
        const genreStatus = $(this).val();
        console.log(genreStatus);
        getEvents(genreStatus);
    }

    function deleteEvent() {
        const currentEvent = $(this);
        const id = currentEvent[0].id;
        $.ajax({
            method: "DELETE",
            url: "/api/event/" + id
        }).then(function () {
            location.reload(true);
        })
    }
    eventForm.on("submit", function (event) {
        event.preventDefault();
        location.reload(true);
        // Grab values from form
        var eventData = {
            band: inputBand.val().trim(),
            place: inputLocation.val().trim(),
            description: inputDescription.val().trim(),
            date: inputDate.val().trim(),
            genre: inputGenre.val().trim(),
            user_id: userId
        };

        createEvent(eventData);
    });
    function getEvents(genre) {
        if (genre) {
            eventArea.empty();
            $.get("/api/events/" + genre, function (events) {
                events.forEach(event => {
                    eventArea.prepend(renderEvent(event));
                    console.log(events)
                })
            })
            } else {
                $.get("/api/events", function (events) {
                    events.forEach(event => {
                        eventArea.prepend(renderEvent(event));
                    })
                });
            }
    }

        getEvents();

        function createEvent(data) {
            // Deconstructed values
            let { band, place, description, date, genre, user_id } = data;
            //Post data through api route
            $.post("/api/addevent", {
                band: band,
                place: place,
                description: description,
                date: date,
                genre: genre,
                user_id: user_id
            }).then(function (data) {
                // Redirect to members.html
                window.location.replace("/members");
            }).catch(function (err) {
                // Thow error
                if (err) throw err;
            });
        }

        function renderEvent(data) {
            // Deconstructed values
            let { id, band, place, description, date, genre } = data;

            // Render html for event
            return $( /*html*/ `
            <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${band}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${place}</h6>
                  <p class="card-text">${description}</p>
                  <p class="card-text">Date: ${date}</p>
                  <p class="card-text">Genre: ${genre}</p>
                  <button type="button" id=${id} class="delete btn btn-danger">Delete</button>
                </div>
            </div>
            <br>
        `);
        }

    });

