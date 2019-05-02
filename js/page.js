var alarmOn = false;


window.onload = function(){

  //EVENT LISTENER
  document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('.next') && !event.target.matches('.back')) return;

  // Otherwise, do the thing
  else if(event.target.matches('.next')) {
    //Next button handler
    if(event.target.matches('.step1')){ swapDrawers(0,1); }
    else if(event.target.matches('.step2')){ swapDrawers(1,2); alarmOn = true; }
  }
  else if(event.target.matches('.back')){
    //Back button handler
    if(event.target.matches('.step2')){ swapDrawers(1,0); }
    else if(event.target.matches('.step3')){ swapDrawers(2,1); }
  }
  else{
    //this should never happen.
    console.log("yeet");
  }

	// Don't follow the link
	event.preventDefault();

}, false);


}

function swapDrawers(closeIndex, openIndex){
  let drawerToClose = document.getElementsByClassName("drawer")[closeIndex];
  drawerToClose.classList.remove("open");
  drawerToClose.classList += " closed";
  let drawerToOpen = document.getElementsByClassName("drawer")[openIndex];
  drawerToOpen.classList.remove("closed");
  drawerToOpen.classList += " open";
}
