function setPhraseOnId(elementSelect, elementText, phrase){
   $(elementSelect).click(function(d){
    if ($(elementSelect).prop('checked')) {
      $(elementText).val(phrase);
    } else{
      if ($(elementText).val() === (phrase)){
        $(elementText).val("");
      }
    }
  });
}  

$(document).ready(function(d) {
  $(".student").prop('disabled', true);
  
  $("button[type=submit]").click(function(d) {
    alert("form submitted!");
  });
  
  $("#job").click(function(d) {
    $(".student").prop('disabled', !$("#job").prop('checked'));
    $(".nonstudent").prop('disabled', $("#job").prop('checked'));
  });
  
  setPhraseOnId("#dust","#jobreason","It's too dusty!");
  setPhraseOnId("#computer","#jobreason","No, I wish I were outside!");
  setPhraseOnId("input:odd","#reason","Yes");
});