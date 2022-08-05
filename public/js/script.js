$( document ).ready(function() {
           
    const baseUrl = 'http://localhost:3000';
    // const baseUrl = 'https://grow-glide.herokuapp.com';

    var userID = null;
    var userName = null;

    update();

    function update() {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${baseUrl}/api/users`, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            console.log(result);

            result.forEach((data, index) => {
                console.log(typeof data.private);

                $('#t-body').append(`
                    <tr>
                        <th scope="row">${++index}</th>
                        <td class="channel-id">${data.channelId}</span></td>
                        <td class="channel-name group-channel" data-bs-toggle="modal" data-bs-target="#staticBackdrop">${data.channelName}</td>
                        <td>${(data.private === 'true' ? 'Private' : 'Public')}</td>
                        <td>${(data.archived ? 'Yes' : 'No')}</td>
                        <td>${data.memberId}</td>
                        <td id="${data.memberId}" class="user-name">${data.memberName}</td>
                        <td>
                            <div class="form-check form-switch c-pointer">
                                <input id="${data.memberId}~${data.channelId}" class="form-check-input permanent-user-id" 
                                    type="checkbox" ${data.permament ? 'checked' : ''}>
                            <div>
                        </td>
                    </tr>
                `);

            });

        })
        .catch(error => console.log('error', error));

    }
      

    $('body').on('click', function(event){
        // console.log('event.target', event.target)

        if ( event.target.classList.contains('user-name')){
            $('.user-name').css({'background-color' : "#FFFFFF"})
            $(event.target).css({'background-color' : "#DFE8F8"})
            $( ".user-drop" ).remove();
            userID = $(event.target).attr('id'); 
            console.log($(event.target).attr('id'));
            userName = $(event.target).text(); 


            $('body').append(`
                <div class="user-drop">
                <div class="drop-head">
                    <span> Actions</span>
                </div>
                <div class="drop-item">
                    <span class="number">1</span>
                    <span> Set Admin</span>
                </div>
                <div class="drop-item">
                    <span class="number">2</span>
                    <span class="invite-to-channel" data-bs-toggle="modal" data-bs-target="#addToChannel"> Invite to channel</span>
                </div>   
                </div>
            `);  
  
            $('.user-drop').css({
                "top" : event.pageY + 25,
                "left" :  event.pageX
            });
        } else {
            $( ".user-drop" ).remove();
        }


    });



    $('body').on('click', '.group-channel', function(event){
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${baseUrl}/api/all-channels`, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            $('.select-list-channels').html('');
            result.forEach((data, index) => {
                $('.select-list-channels').append(`<option value="${data.id}~${data.name}">${data.name}</option>`);
            });

        })
        .catch(error => console.log('error', error));
    });




    $('body').on('click', '.invite-to-channel', function(event){
        $('#addToChannelLabel').html('');
        $('#addToChannelLabel').html(`<span> Add <span class='gr-c'>${userName}</span> to channel </span>`);
        $('.select-list-channels')

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${baseUrl}/api/all-channels`, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            $('.select-list-channels').html('');
            result.forEach((data, index) => {
                $('.select-list-channels').append(`<option value="${data.id}~${data.name}">${data.name}</option>`);
            });

        })
        .catch(error => console.log('error', error));


        fetch(`${baseUrl}/api/channel/groups`, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            // console.log(result);
            
            $('.select-list-channels-groups').html('');
            result.forEach((data, index) => {
                console.log(data._id, data.name);
                $('.select-list-channels-groups').append(`<option value="${data._id}">${data.name}</option>`);
            });

        })
        .catch(error => console.log('error', error));
    });


$('body').on('click', '#createGroup', function(event){
    var _this = $(this);

    // console.log(_this);
    let groupName = $('#newGroupName').val();
    let channels = $('#channelsToGroup').val();
    let channelCount = channels.length;

    channels = JSON.stringify(channels);
    $('.errorMessage').html("");


    if (groupName.length > 0 && channelCount > 1){
        var settings = {
            "url": `${baseUrl}/api/channel/group/create`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "groupName": groupName,
                "channels": channels
            }
        };
            
        $.ajax(settings).done(function (response) {
            console.log(response);

            var myModalEl = document.getElementById('staticBackdrop');
            var modal = bootstrap.Modal.getInstance(myModalEl)
            modal.hide();

            successAlert('The group was successfully created!');

            $('#newGroupName').val('');

        });
    } else {

        if (groupName.length === 0){
            $('.errorMessage').html("Group name can't be empty!");
        }

        if (channelCount <= 1){
            $('.errorMessage').html("Must be selected at last 2 channels!");
        }
        

    }
});



$('body').on('click', '#sendInvitation', function(){
    
    // console.log(_this);
    let singleChannels = $('#singleChannels').val();
    let groupChannels = $('#groupChannels').val();
    singleChannels = JSON.stringify(singleChannels);
    groupChannels = JSON.stringify(groupChannels);

    console.log(userID, '----', singleChannels, '--', groupChannels);

    var settings = {
        "url": `${baseUrl}/api/slack/send/invitation`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "singleChannels": singleChannels,
            "groupChannels": groupChannels,
            "userId": userID
        }
    };
        
    $.ajax(settings).done(function (response) {
        console.log(response);

        var myModalEl = document.getElementById('addToChannel');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();

        successAlert('The invitation was sent!');
    });


});


$('body').on('click', '.permanent-user-id', function(){

    let isChecked = $(this).is(':checked');
    let ids = $(this).attr('id');
    ids = ids.split('~')
    let userId = ids[0];
    let channelId = ids[1];

    console.log(isChecked, userId, channelId);

    var settings = {
        "url": `${baseUrl}/api/permament`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "isChecked": isChecked,
            "userId": userId,
            "channelId": channelId
        }
    };
        
    $.ajax(settings).done(function (response) {
        console.log(response);
    });


});





function successAlert (text){

    $('body').append(`<div class="alert alert-success" role="alert">${text}</div>`);

    setTimeout(() => {
        $('.alert-success').remove();
    }, "5000")
}






});