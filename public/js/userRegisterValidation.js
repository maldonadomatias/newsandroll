window.onload = function () {
    //------DESDE AQUÍ CONTINUE CON LAS VALIDACIONES DEL FORMULARIO -------//    
    let form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        console.log("paso");
        // creamos un arreglo que contendrá los errores eventuales
        let errors = [];
        let name = document.querySelector('#name');
        let email = document.querySelector('#email');
        let password = document.querySelector('#password');

        if (name.value == '') {
            errors.push('"Full Name" field can not be empty');
            name.classList.add('is-invalid');
        } else {
            name.classList.add('is-valid');
            name.classList.remove('is-invalid');
        };
        if (email.value == "") {
            errors.push('"Email" field can not be empty');
            email.classList.add('is-invalid');
        } else {
            email.classList.add('is-valid');
            email.classList.remove('is-invalid');
        };
        if (password.value == '') {
            errors.push('"Password" field can not be empty');
            password.classList.add('is-invalid');
        } else {
            password.classList.add('is-valid');
            password.classList.remove('is-invalid');
        };

        //Aquí controlo que es lo que debo hacer si hay o no errores en el formulario

        if (errors.length > 0) {
            e.preventDefault();
            let ulErrors = document.querySelector('.errors');
            ulErrors.classList.add('alert-warning');
            ulErrors.innerHTML = '';
            for (let i = 0; i < errors.length; i++) {
                ulErrors.innerHTML += `<li >  ${errors[i]} </li>`;
            };
        } else {
            form.submit();
        }

    });


}