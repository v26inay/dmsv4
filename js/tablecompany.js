$(document).ready(function() {
    $("input[name$='radBtn']").click(function() {
        var test = $(this).val();
        $("div.shwHid").hide();
        $("#show" + test).show();
        $("#myInpTabV" + test).focus();
    });
});
function myFunTabV1() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInpTabV1");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableV1");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
};
function myFunTabV2() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInpTabV2");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableV2");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
};
function myFunTabV3() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInpTabV3");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableV3");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
};
function tablecompany() {};