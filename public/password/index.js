document.getElementById('pass').addEventListener('submit', async (event) => {
    event.preventDefault();

    const errMsg = document.getElementById('err');
    errMsg.innerText = '';

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) window.location.href = '/main'; 
        else if (response.status === 401){
            const errData = await response.json();
            errMsg.innerText = errData.msg;
        }
    } catch (error) { errMsg.innerText = 'Network Error....'; }
});