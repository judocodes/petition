(function () {
    console.log('Wroks');
    const passwordInput = document.getElementById('password-input');
    const passwordText = document.getElementById('password-text');

    passwordInput.addEventListener('input', e => {
        if (e.target.value === 'password') {
            passwordText.classList.add('text-red-600');
            passwordText.innerText = '"Password" will just be ignored.';
        } else {
            passwordText.classList.remove('text-red-600');
            passwordText.innerText = 'Change Password';
        }
    });
})();
