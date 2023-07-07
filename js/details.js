console.log("The Deets");

const printingsArray = JSON.parse(sessionStorage.getItem("printingsArray"))

$("title").text(printingsArray[0].name + " - MTG Conclave")
$("h1").text(printingsArray[0].name)
$("#detailImg").css("backgroundImage", "url(" + printingsArray[0].imageUrl + ")")

console.log($("#detailImg"))