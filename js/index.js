
function click(task){
	let input = document.getElementById("input").value;
	let dot_for_blank = document.getElementById("dotForBlank").checked;
	let output = task(input, dot_for_blank);
	document.getElementById("input").value = output;
}

function invert_click(){
	click(invert);
}

function rotate_click(){
	click(turn_90);
}

function mirror_click(){
	click(mirror);
}
