// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
//import firebase from "firebase/app";
//import "firebase/database";
var input;
var world;
var size;
var after;
var leng;
var number;
var answer;
let history=[];
var cor_list;
var wrong_list;
var quiz;
var radio;
var correct;
var country_capital_pairs;
var country_place;
var timer;
var clear_btn;
var undo_btn;
var reset_btn;
let first=true;
//let now_list;
let status=0;
var coordinate;
var Snode;
var selected="all";
var capital;

var firebaseConfig = {
  apiKey: "AIzaSyAPxSZo2bsaPA4nsjM1kSmbTbOKZ-MCsqQ",
  authDomain: "hci-pr3-2e3cf.firebaseapp.com",
  databaseURL: "https://hci-pr3-2e3cf-default-rtdb.firebaseio.com",
  projectId: "hci-pr3-2e3cf",
  storageBucket: "hci-pr3-2e3cf.appspot.com",
  messagingSenderId: "592168809468",
  appId: "1:592168809468:web:bd39c5c399337679ac7879",
  measurementId: "G-DVM9WG828F"
};


$( document ).ready(function() {
  //console.log("hi");
  country_capital_pairs=[];
  country_place=[];
  cor_list=new Array();
  wrong_list=new Array();
  //now_list=new Array();
  radio=1;
  quiz=document.getElementById("quiz_table");
  size=2;
  after=document.getElementById("pr2__button");
  input=document.getElementById("pr2__capital");
  world=document.getElementById("pr2__country");
  clear_btn=document.getElementById("pr3__clear");
  undo_btn=document.getElementById("pr3__undo");
  reset_btn=document.getElementById("pr3__reset");
  Snode=document.getElementsByName('show');

  $.ajax({
    url: 'https://cs374.s3.ap-northeast-2.amazonaws.com/country_capital_geo.csv',
    dataType: 'text',
    async: false,
    success: function(data){
      var allRows=data.split(/\r?\n|\r/);
      for(var i=1; i<allRows.length; i++){
        var eachRow=allRows[i].split(",");
        //console.log({"country": eachRow[0],"capital": eachRow[1]});
        country_capital_pairs.push({country: eachRow[0],capital: eachRow[1]});
        country_place.push({country: eachRow[0], coordinates: [eachRow[2], eachRow[3]]});
      }

    }});

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    const dbRef=firebase.database().ref("quiz/");
    input.focus();

    //Should check our status now....
    dbRef.on('value', (snapshot)=>{
      var data=snapshot.val();
      if(data&&first){
        //console.log("first");
        data.shift(); //remove empty after refresh
        //console.log(data);
        status=data.length;
        //console.log(status);
        if(status!=0){
          history=data[status-1];
        }
        console.log(history);
        LtoTable(history);
      }
      first=false;
    });

    window.pairs=country_capital_pairs;
    window.coordinates=country_place;
    leng=country_capital_pairs.length;
    number=Math.floor(Math.random()*leng);
    //console.log(country_pairs[number]);
    world.innerHTML= country_capital_pairs[number].country;
    answer=country_capital_pairs[number].capital;
    coordinate=country_place[number].coordinates;
    map.setCenter(coordinate);
    const newRow=quiz.insertRow(size);
    newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";	
  
    input.addEventListener('keypress', function(e){
      if(e.keyCode==13){
      //console.log(input);
      AnswerCheck();
      //$('#pr2__capital').autocomplete('close');
      }
    });

    after.addEventListener('click',function(){
      AnswerCheck();
    });
    capital=country_capital_pairs.map(country_capital_pairs=>country_capital_pairs.capital);
});

//Firebase Functions
function write_firebase(where){
  //console.log("write to firebase");
  //console.log(where);
  //console.log(history.length);
  if(history.length==0){
    console.log("0 written");
    firebase.database().ref("quiz/"+ where).set(0);
  }
  else{
    firebase.database().ref("quiz/"+where).set(history);
  }
}

function clear_firebase(){
  console.log(history);
  if(history.length==0){
    alert("No items to clear");
  }
  else{
    history=[];
    history.length=0;
    //console.log(history);
    status++;
    write_firebase(status);
    DelTable();
    var newRow=quiz.insertRow(2);
	  newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
    size=2;
  }
}

function undo_firebase(){
  //console.log(history.length);
  if(status==0){
    alert("Nothing to undo");
  }
  else if(status>0){ //status sometimes become minus
    firebase.database().ref('quiz/'+ status).remove();
    status--;
    if(status==0){
      history=[];
    }

    var nowRef=firebase.database().ref('quiz/'+ status);
    nowRef.on('value', (snapshot)=>{
      const data=snapshot.val();
      history=data;
      //console.log(history);
      LtoTable(history);
      //create new list with this info.
    });
    if(history.length==0){
      size=2;
    }
    else{
      size=history[history.length-1][4]+1;
    }
    console.log(status);
    console.log(history);
    
  }
}

function reset_firebase(){
  status=0;
  history=[];
  history.length=0;
  //console.log(history);
  firebase.database().ref('quiz/').set(null);
  DelTable();
  var newRow=quiz.insertRow(2);
	newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
  size=2;

  input.value="";
	input.focus();
	number=Math.floor(Math.random()*leng);
	world.innerHTML= country_capital_pairs[number].country;
	answer=country_capital_pairs[number].capital;
  coordinate=country_place[number].coordinates;
  map.setCenter(coordinate);
  AnswerCheck();
}

function findcoord(name, mode){
  let what;
  if(mode=="country"){
    what=country_place.find(element=>element.country==name);
    //console.log("country");
    //console.log(what);
  }
  else if(mode="capital"){
    //console.log("capital");
    let what_country=country_capital_pairs.find(element=>element.capital==name)
    //if(what_country!=undefined) console.log("Find it");
    what=country_place.find(element=>element.country==what_country.country);
    //console.log(what);
  }
  if(what==undefined){
    console.log("I cannot find it");
    alert("error");
    return;
  }
  //console.log("found!")
  return what.coordinates;
}

$(document).on('mouseenter', '#pr2__country', function(e){
  timer=setTimeout(function(){
    //console.log("in country");
    map.setStyle("mapbox://styles/mapbox/satellite-streets-v11");
    map.setZoom(4);
    $("#map").css("border", "3px solid orange");
    map.setCenter(findcoord(e.toElement.innerText, "country"));
  }, 500);
});

$(document).on('mouseout', '#pr2__country', function(e){
  $("#map").css('border', 'none');
});

$(document).on('mouseenter', '#new_country', function(e){
  //console.log("in list country");
  timer=setTimeout(function(){
    map.setStyle("mapbox://styles/mapbox/satellite-streets-v11");
    map.setZoom(4);
    $("#map").css("border", "3px solid orange");
    map.setCenter(findcoord(e.toElement.innerText, "country"));
  }, 500);
});

$(document).on('mouseout', '#new_country', function(e){
  $("#map").css('border', 'none');
});

$(document).on('mouseenter', '#new_capital', function(e){
  //console.log("in list capital");
  timer=setTimeout(function(){
    map.setStyle("mapbox://styles/mapbox/dark-v10");
    map.setZoom(6);
    $("#map").css("border", "3px solid black");
    map.setCenter(findcoord(e.toElement.innerText, "capital"));
  }, 500);
});

$(document).on('mouseout', '#new_capital', function(e){
  map.setStyle("mapbox://styles/mapbox/satellite-streets-v11");
  map.setZoom(4);
  $("#map").css('border', 'none');
});


/*
//auto complete
$(function(){
	var capital=country_capital_pairs.map(country_capital_pairs=>country_capital_pairs.capital);
	//console.log(capital[0]);
  $('#pr2__capital').autocomplete({
		source: capital,
		select: function(event, ui){
      console.log("hi");
      //do not come to here.....why?
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
*/

//delete button
$(document).on("click", ".delBut", function(){
	var rnum=$(this).closest('tr').index();
  //console.log(rnum);
	var whattodel;

	if(radio==1){
		whattodel=history[rnum-1][0];
	}
	if(radio==2){
		whattodel=cor_list[rnum-1][0];
	}
	if(radio==3){
		whattodel=wrong_list[rnum-1][0];
	}

	//console.log(whattodel);
	DelHistory(whattodel);
	quiz.deleteRow(rnum+1);
  status++;
  //console.log(status);
  console.log(history.length);
  write_firebase(status);
	size=size-1;
  //console.log(size);
	if(size==2){
		const newRow=quiz.insertRow(2);
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

function Selection(what){
  //console.log(what.selectedIndex);//undefined..
  var selected=what[what.selectedIndex].value;
  console.log(selected);

  if(selected=="all"){
      //alert("all");
      radio=1;
      if(Object.keys(history).length==0){
        DelTable();
        var newRow=quiz.insertRow(2);
        newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";	
      }
      else{
        LtoTable(history);
      }
      
  }
  if(selected=="correct"){
      //alert("correct");
      radio=2;
      cor_list=CorW(true);
      if(cor_list.length==0){
        //console.log("empty");
        DelTable();
        var newRow=quiz.insertRow(2);
        newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";	
      }
      else{
        LtoTable(cor_list);
      }
      
  }
  if(selected=="wrong"){
      radio=3;
      //alert("wrong");
      wrong_list=CorW(false);
      if(wrong_list.length==0){
        //console.log("empty");
        DelTable();
        var newRow=quiz.insertRow(2);
        newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		

      }
      else{
        LtoTable(wrong_list);
      }
      
			}
}

function CorW(correct){
	var result=new Array();
	var new_num=0;
	const long=Object.keys(history).length;
  //console.log("CorW"+long);
  //console.log(history.length);
	for(let i=0; i<long; i++){
    //console.log(history[i]);
		if(history[i][3]==correct){
			result[new_num]=history[i];
			new_num+=1;
		}
	}
	return result;
}

function DelTable(){
	//console.log(quiz.rows.length);
	for(let i=quiz.rows.length-1; i>1; i--){
		//console.log("delete all rows");
		//console.log(i);
		quiz.deleteRow(i);
	}
}

function LtoTable(theL){
	
	DelTable();
  if(theL==null || theL==0 ){
		var newRow=quiz.insertRow(2);
		newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
	}
  else{
    if(theL.length==0){
      //console.log("hi");
      var newRow=quiz.insertRow(2);
      newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
    }
    else{
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
          const resRow=quiz.insertRow(number+2);
          const resCoun=resRow.insertCell(0);
          resCoun.setAttribute("id", "new_country");
          const resCap=resRow.insertCell(1);
          const resAns=resRow.insertCell(2);
          resAns.setAttribute("id", "new_capital");
          number+=1;
          //console.log(quiz.rows.length);
          resCoun.innerText=coun_name;
          if(correct_ans==true){
            style.innerHTML="";
            resCap.innerText=cap_name;
            resAns.innerHTML='<td>'+cap_name+'<input type="button" class="delBut" value="Remove"></td>';
            resCoun.style.color="green";
            resCap.style.color="green";
            resAns.style.color="green";
          }
          else{
            var strike="<s>"+input_name+"</s>";
            resCap.innerHTML=strike;
            resAns.innerHTML='<td>'+cap_name+'<input type="button" class="delBut" value="Remove"></td>';
            resCoun.style.color="red";
            resCap.style.color="red";
            resAns.style.color="red";
          }
        }
        
      }
      if((radio==2&&cor_list.length==0)||(radio==3&&wrong_list.length==0)){
        var newRow=quiz.insertRow(2);
        newRow.innerHTML ="<td colspan='3' align='center'>No entry to show</td>";		
      }
    }
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
  console.log(history);
	var information=[country_capital_pairs[number].country, check,  answer,  correct, size ];
  console.log(history);
  history[size-2]=information;
  //console.log(history);
  //console.log(history.length);
  status++;
  write_firebase(status);
	cor_list=CorW(true);
	wrong_list=CorW(false);
	LtoTable(history);
	input.value="";
	input.focus();
	number=Math.floor(Math.random()*leng);
	world.innerHTML= country_capital_pairs[number].country;
	answer=country_capital_pairs[number].capital;
  coordinate=country_place[number].coordinates;
  map.setCenter(coordinate);
	size+=1;
	}
}
