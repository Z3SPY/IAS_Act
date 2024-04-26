

document.getElementById('subForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default submission

    const userName: string = (<HTMLInputElement>document.getElementById('userName')).value;
    const passText: string = (<HTMLInputElement>document.getElementById('pswrdText')).value;
    const passConf: string = (<HTMLInputElement>document.getElementById('pswrdTextConf')).value;

    //Print //erase later
    console.log('user: ', userName);


    validateForm();
});


function validateForm() {
    console.log("Validate Form");
}