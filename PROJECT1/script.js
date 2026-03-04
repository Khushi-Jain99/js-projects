const buttons = document.querySelectorAll('.button');
const body = document.querySelector("body");

buttons.forEach(function(button){
    console.log(button);
    button.addEventListener('click', function(ev){
        console.log(ev);
        console.log(ev.target);
        if(ev.target.id == 'sky'){
            body.style.backgroundColor = '#4cc9f0';
        }
        if(ev.target.id == 'pink'){
            body.style.backgroundColor = '#f72585';
        }
        if(ev.target.id == 'purple'){
            body.style.backgroundColor = '#7209b7';
        }
        if(ev.target.id == 'blue'){
            body.style.backgroundColor = '#3a0ca3';
        }
    })
});