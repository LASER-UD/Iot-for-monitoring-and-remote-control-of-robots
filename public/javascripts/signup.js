let username;
let name;
let lastName;
let email;
let password;
let confirmPassword;

$('#name').blur(function() {

    const field = document.getElementById('name');
    if (field.value == '' || field.value == undefined) {
        field.className = 'form-control is-invalid';
        name = false;
    } else {
        field.className = 'form-control is-valid';
        name = true;
    }
});

$('#user').blur(function() {

    const field = document.getElementById('user');
    if (field.value == '' || field.value == undefined) {
        field.className = 'form-control is-invalid';
        username = false;
    } else {
        $.ajax({
            url: '/api/username',
            type: 'POST',
            data: {
                username: field.value
            },
            dataType: 'json',
            success: function(respuesta) {
                if (respuesta.user) {
                    field.className = 'form-control is-invalid';
                    username = false;
                } else {
                    field.className = 'form-control is-valid';
                    username = true;
                }

            },
            error: function() {
                alert('Ups ! Algo ha salido mal' + e);
                username = false;
            }
        });
    }
});


$('#lastName').blur(function() {

    const field = document.getElementById('lastName');
    if (field.value == '' || field.value == undefined) {
        field.className = 'form-control is-invalid';
        lastName = false;
    } else {
        field.className = 'form-control is-valid';
        lastName = true;
    }
});

$('#email').blur(function() {
    const field = document.getElementById('email');
    fieldValue = field.value;
    if (fieldValue == '' || fieldValue == undefined) {
        field.className = 'form-control is-invalid';
        email = false;
    } else {
        if (fieldValue.includes('@') && fieldValue.includes('.')) {
            $.ajax({
                url: '/api/email',
                type: 'POST',
                data: {
                    email: fieldValue,
                },
                dataType: 'json',
                success: function(respuesta) {
                    if (respuesta.user) {
                        field.className = 'form-control is-invalid';
                        email = false;
                    } else {
                        field.className = 'form-control is-valid';
                        email = true;
                    }

                },
                error: function() {
                    alert('Ups ! Algo ha salido mal' + e);
                    email = false;
                }

            });
        } else {
            field.className = 'form-control is-invalid';
            email = false;
        }
    }
});

function passField() {
    const field = document.getElementById('password');
    if (field.value.length < 8) {
        field.className = 'form-control is-invalid';
        password = false;
    } else {
        field.className = 'form-control is-valid';
        password = true;
    }
}

$('#password').blur(function() {
    passField();
});

function passConfirmField() {
    const field = document.getElementById('confirmPassword');
    const field2 = document.getElementById('password');
    if (field.value == field2.value) {
        if (field.value.length < 8) {
            field.className = 'form-control is-invalid';
            confirmPassword = false;
        } else {
            field.className = 'form-control is-valid';
            confirmPassword = true;
        }
    } else {
        field.className = 'form-control is-invalid';
        confirmPassword = false;
    }
}

$('#confirmPassword').blur(function() {
    passConfirmField();
});

$('#btnSubmit').click(function(e) {
    if (username && name && lastName && email && password && confirmPassword) {
        $.ajax({
            url: '/api/signup',
            type: 'POST',
            data: {
                password: document.getElementById('password').value,
                email: document.getElementById('email').value,
                username: document.getElementById('user').value,
                name: document.getElementById('name').value,
                lastName: document.getElementById('lastName').value
            },
            dataType: 'json',
            success: function(respuesta) {
                if (respuesta.saved) {
                    alert('Guardado');
                } else {
                    alert('Error');
                }
            },
            error: function() {
                alert('Ups ! Algo ha salido mal' + e);
                email = false;
            }
        });
    } else {
        alert('Nopo');
    }
});