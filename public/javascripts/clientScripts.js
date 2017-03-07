
$('.confirmation').on('click', function() {
    return confirm('Are you sure you want to delete this?');
});

$('.success').on('click', function() {
    return confirm('Are you sure you want to buy this?');
});

var additemForm = document.getElementById("addItemView");
additemForm.style.display = "none";


document.getElementById("addNewItem").addEventListener("click", function() {

    document.getElementById("itemsDisplay").style.display = "inline-table"; 
    document.getElementById("itemsDisplay").style.marginTop = "5%";

    additemForm.style.display = "block";
    
});
