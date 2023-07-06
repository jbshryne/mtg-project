console.log("The Deets");

const card = JSON.parse(sessionStorage.getItem("detailsPage"))

console.log(card)

$("h1").text(card.name)
$("#detailImg").css("backgroundImage", "url(" + card.imageUrl + ")")

console.log($("#detailImg"))