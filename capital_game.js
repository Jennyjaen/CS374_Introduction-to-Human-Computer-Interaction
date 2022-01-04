// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
var input;
var world;
var size;
var after;
var leng;
var number;
var answer;
var history;
var cor_list;
var wrong_list;
var country_capital_pairs;
var quiz;
var radio;
var correct;
$( document ).ready(function() {
  country_capital_pairs = pairs
  console.log(pairs);
  leng=country_capital_pairs.length;
  number=Math.floor(Math.random()*leng);
  world=document.getElementById("pr2__country");
  world.innerHTML= country_capital_pairs[number].country;
  answer=country_capital_pairs[number].capital;
  history=new Array();
  cor_list=new Array();
  wrong_list=new Array();
  radio=1;
  quiz=document.getElementById("quiz_table");
  size=3;
  after=document.getElementById("pr2__button");
  input=document.getElementById("pr2__capital");
  //new AutoComplete(document.querySelector('#autocomplete'), list);
 

  input.focus();

  const newRow=quiz.insertRow(size);
  newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";	


  input.addEventListener('keypress', function(e){
  	if(e.keyCode==13){
		//console.log(input);
		AnswerCheck();
		$('#pr2__capital').autocomplete('close');
  	}
  });
	after.addEventListener('click',function(){
		AnswerCheck();
	});

	
});

//auto complete
$(function(){
	var capital=pairs.map(pairs=>pairs.capital);
	$('#pr2__capital').autocomplete({
		source: capital,
		select: function(event, ui){
			event.preventDefault();
			if(ui.item){
				$(event.target).val(ui.item.value);
			}
			document.getElementById("pr2__button").click();
			//$(this).data().autocomplete.term=null;
			//console.log(ui.item);
			return false;
		},
		focus: function(event, ui){
			return false;
		},
		minLength: 2,
		autoFocus: false,
		classes: {
			'ui-autocomplete' : 'highlight'
		},
		disable: false,
		close: function(event){
			//console.log(event);
		}

	})
})


//delete button
$(document).on("click", ".delBut", function(){
	var rnum=$(this).closest('tr').index();
	var whattodel;
	if(radio==1){
		whattodel=history[rnum-2][0];
	}
	if(radio==2){
		whattodel=cor_list[rnum-2][0];
	}
	if(radio==3){
		whattodel=wrong_list[rnum-2][0];
	}
	

	//console.log(whattodel);
	DelHistory(whattodel);
	quiz.deleteRow(rnum+1);

	size=size-1;
	if(size==3){
		const newRow=quiz.insertRow(size);
		newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
	}
	input.focus();
	AnswerCheck();
});

function DelHistory(name){
	var leng=Object.keys(history).length;
	//console.log(name);
	var number=0;
	for(i in Object.values(history)){
		if(Object.values(history)[i].includes(name)){
			break;
		}
		else{
			number+=1;
		}
	}
	for(i=number; i<leng-1; i++){
		history[i]=history[i+1];
	}
	delete history[leng-1];
	cor_list=CorW(true);
	wrong_list=CorW(false);
}

function Selection(){
	const Snode=document.getElementsByName('show');
	Snode.forEach((node)=>{
		if(node.checked){
			if(node.value=="all"){
					//alert("all");
					radio=1;
					if(Object.keys(history).length==0){
						DelTable();
						var newRow=quiz.insertRow(3);
						newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";	
					}
					else{
						LtoTable(history);
					}
					
			}
			if(node.value=="correct"){
					//alert("correct");
					radio=2;
					cor_list=CorW(true);
					if(cor_list.length==0){
						//console.log("empty");
						DelTable();
						var newRow=quiz.insertRow(3);
						newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";	
					}
					else{
						LtoTable(cor_list);
					}
					
			}
			if(node.value=="wrong"){
					radio=3;
					//alert("wrong");
					wrong_list=CorW(false);
					if(wrong_list.length==0){
						//console.log("empty");
						DelTable();
						var newRow=quiz.insertRow(3);
						newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		

					}
					else{
						LtoTable(wrong_list);
					}
					
			}
	}
		
	})

}

function CorW(correct){
	var result=new Array();
	var new_num=0;
	const long=Object.keys(history).length;
	for(let i=0; i<long; i++){
		if(history[i][3]==correct){
			result[new_num]=history[i];
			new_num+=1;
		}
	}
	return result;
}

function DelTable(){
	//console.log(quiz.rows.length);
	for(let i=quiz.rows.length-1; i>2; i--){
		//console.log("delete all rows");
		//console.log(i);
		quiz.deleteRow(i);
	}
}

function LtoTable(theL){
	if(theL==null){
		alert("none");
	}
	
	DelTable();
	const long=Object.keys(theL).length;
	var number=0;
	for(let i =0; i<long; i++){
		//console.log(theL[i]);
		const coun_name=theL[i][0];
		const input_name=theL[i][1];
		const cap_name=theL[i][2];
		const correct_ans=theL[i][3];

		if(radio==1 || (radio==2&&correct_ans==true)||(radio==3 && correct_ans==false)){
			var style=document.createElement('style');
			const resRow=quiz.insertRow(number+3);
			const resCoun=resRow.insertCell(0);
			const resCap=resRow.insertCell(1);
			const resAns=resRow.insertCell(2);
			number+=1;
			//console.log(quiz.rows.length);
			resCoun.innerText=coun_name;
			if(correct_ans==true){
				style.innerHTML="";
				resCap.innerText=cap_name;
				resAns.innerHTML='<i class="fas fa-check"></i><td><input type="button" class="delBut" value="delete"></td>';
				resCoun.style.color="blue";
				resCap.style.color="blue";
				resAns.style.color="blue";
			}
			else{
				var strike="<s>"+input_name+"</s>";
				resCap.innerHTML=strike;
				resAns.innerHTML='<td>'+cap_name+'<input type="button" class="delBut" value="delete"></td>';
				resCoun.style.color="red";
				resCap.style.color="red";
				resAns.style.color="red";
			}
		}
		
	}
	if((radio==2&&cor_list.length==0)||(radio==3&&wrong_list.length==0)){
		var newRow=quiz.insertRow(3);
		newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
	}
}


function AnswerCheck(){
	var check=input.value;
	if(check.length!=0){
		/*if(size==3){
			quiz.deleteRow(3);
	}*/

	if(check.toLowerCase()==answer.toLowerCase()){
		correct=true;
	}
	else{
		correct=false;
	}
	var information=[country_capital_pairs[number].country, check,  answer,  correct, size ];
	history[size-3]=information;
	cor_list=CorW(true);
	wrong_list=CorW(false);
	LtoTable(history);
	input.value="";
	input.focus();
	number=Math.floor(Math.random()*leng);
	world.innerHTML= country_capital_pairs[number].country;
	answer=country_capital_pairs[number].capital;
	size+=1;
	}
}

