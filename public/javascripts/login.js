$('#email').blur(function() {
    const field = document.getElementById('email');
    fieldValue = field.value;
    if (fieldValue == '' || fieldValue == undefined) {
        field.className = 'form-control is-invalid';
        email = false;
    } else {
        if (fieldValue.includes('@') && fieldValue.includes('.')) {
            email = true;
            field.className = 'form-control is-valid';
        } else {
            field.className = 'form-control is-invalid';
            email = false;
        }
    }
});

document.getElementById('btn-login-input').addEventListener('click', function(e) {
    if (!email) {
        e.preventDefault();
    }

});