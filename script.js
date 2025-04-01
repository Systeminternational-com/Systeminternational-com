document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

function signup() {
    const email = document.getElementById('emailInput').value;
    if (email) {
        alert(`Thank you for signing up, ${email}!`);
    } else {
        alert('Please enter a valid email.');
    }
}
