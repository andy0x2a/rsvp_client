/**
 * Created by andyn on 2/20/2015.
 */

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
var getListOnSuccess = function (data) {

    allData = data;
   

    $(".tbdy").remove();
    var body = $('<tbody class="tbdy"></tbody>');

    $.each(data, function (i, item) {

        var rowStr = '<tr>' +

            '<td>' + item.id + '</td>' +
            '<td>' + item.firstName + '</td>' +
            '<td>' + item.lastName + '</td>' +
            '<td>' + item.phoneNumber + '</td>' +
            '<td>' + item.email + '</td>' +
            '<td>' + item.statusId + '</td>' +
            '<td>' + getMealName(item.mealId) + '</td>' +
            '<td>' + item.address + '</td>' +
            '<td>' + item.association + '</td>' +
            '<td>' + item.notes + '</td>' +
            '<td>' + item.partySize + '</td>' +
            '<td> <a href="#" class="editIcon" id="edit_icon_' + item.id + '" ><img src="src/img/edit.png"/> </a></td>' +
            '</row>';


        var row = $(rowStr);
        body.append(row);


    });
    $("#tbl").append(body);
    $(".editIcon").on('click', function (event) {
        event.preventDefault();
        var elem = $(event.target);
        console.log(elem);

        var id = $(event.target).parent('a').attr('id').substring(10);
        showDataFor(id);
        $("#submitEdit").unbind();
        $("#submitEdit").on('click', submitEditedGuest);

    });
    $('.adminConsole').spin(false);
};
var submitEditedGuest = function () {


        $('.adminEditSingle').spin();

    $('.error').hide();
    var id = $('#id').val().trim();
    var firstName = $('#firstName').val().trim();
    var lastName = $('#lastName').val().trim();
    var email = $('#email').val().trim();
    var contact = $('#contact').val().trim();
    var address = $('#address').val().trim();
    var menu = $('#menuSel option:selected').attr('id');
    var partySize = $("#partySize ").val().trim();
    var notes = $("#notes").val().trim();
    //var association =$('#association option:selected').attr('val').toLowerCase();
    var association = null;
    var attending = true;
    if  ($('#attendings option:selected').attr('id').toLowerCase() == 'no') {
        attending = false;
    }

    var obj = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'phoneNumber': contact,
        'address': address,
        'statusId': attending ? '1' : '0',
        'mealId': menu,
        'notes': notes,
        'association': association,
        'partySize' : partySize,
        'id': id
    };




    var verb = "PUT";
    var onComplete = function (a, b, c) {
        console.log('success');

        $('.adminEditSingle').spin(false);

        $('.adminEditSingle').hide();
        getList();


    }

    var onError = function (a, b, c) {
        console.log('failed');
        alert('Something went wrong');

        $('.adminEditSingle').spin(false);

    };

    isValid = true;
    if (isValid) {
        console.log('submitting');
        var url = serverURL + "guest/" + obj.id;

        callAjax(url, verb, obj, onComplete, onError);

    } else {

        $('.adminEditSingle').spin(false);

        $('.error').show();
    }


};






var showDataFor = function (id) {

    var foundElem;
    $.each(allData, function (i, item) {
        if (item.id == id) {
            foundElem = item;
            return;
        }
    });
    if (foundElem) {
        $(".adminEditSingle").show();


        console.log('need to fill out variables here');

        $('#id').val(foundElem.id);
        $('#firstName').val(foundElem.firstName);
        $('#lastName').val(foundElem.lastName);
        $('#email').val(foundElem.email);
        $('#contact').val(foundElem.phoneNumber);
        $('#address').val(foundElem.address);


        $('#attendings').val(foundElem.statusId ==1? "Yes":"No");

        populateMealDropdownFromAllMeals("#menuSel");


        //$('#association').val((!!foundElem.association)? foundElem.association.capitalize(): null);


        $('#menuSel').val(foundElem.mealId);
        $('#partySize').val(foundElem.partySize);
        $('#notes').val(foundElem.notes);

    }
};
var getList = function () {
    $(".adminConsole").show();
    $('.adminConsole').spin();
    console.log('here');
    adminCallAjax(serverURL + "admin/guests", "GET", null, getListOnSuccess, getListOnError);
};
