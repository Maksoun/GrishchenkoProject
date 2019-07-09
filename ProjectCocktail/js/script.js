var app = new function() {
  var endpoint_general = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
  var endpoint_details = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
  var drinks = [];
  var current_page = 1;
  var records_per_page = 5;

  this.getCoctailsList = async function () {
  	drinks = [];
    var ingredients = document.getElementById('ingredient').value.split(',');
    for (var i in ingredients) {
    	var xhr = new XMLHttpRequest();
	    xhr.open('GET', endpoint_general + '' + ingredients[i], false);
	    xhr.send();
	    if (xhr.status != 200) {
	      console.log(xhr.status + ': ' + xhr.statusText);
	    } else {
	      try {
	        if (drinks && drinks.length == 0) {
	        	drinks = JSON.parse(xhr.responseText).drinks;
	        } else if (drinks && drinks.length > 0) {
	        	var tempDrinks = JSON.parse(xhr.responseText).drinks;
	        	var newDrinks = [];
	        	for (var d in drinks) {
	        		for (var tempDrink in tempDrinks) {
	        			if (drinks[d].idDrink == tempDrinks[tempDrink].idDrink) {
	        				newDrinks.push(drinks[d]);
	        			}
	        		}
	        	}
	        	drinks = newDrinks;
	        }
	      } catch(exp) {
	        drinks = [];
	        console.log('Parse response error', exp);
	      }
	    }
	    if (drinks) {
	    	this.changePage(1);
	    }
    }
    
  }
  this.renderDrinks = function(page) {
    var data;
    if (!page) page = 1;
    if (drinks && drinks.length > 0) {
      data = '<table><thead>' + 
          '<th style="text-align: center;"><strong>Coctail picture</strong></th>' +
          '<th style="text-align: center;"><strong>Coctail name</strong></th>' +  
          '</thead><tbody>';
          
      for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < drinks.length; i++) {
        data += '<tr>' + 
                    '<td style="width:200px;height:200px;"><img width="200" height="200" src="' + 
                    drinks[i].strDrinkThumb + '"/></td>' + 
                    '<td style="text-align: center;"><a href="javascript:void(0)"' + 
                    ' onclick="app.viewDetails(' + drinks[i].idDrink + ');">' + 
                    drinks[i].strDrink + '</a></td>' +
                '</tr>';
      }
      data += '</tbody></table>';
    }
    document.getElementById('table').innerHTML = data ? data : 'No results.';
  }
  this.prevPage = function () {
    if (current_page > 1) {
        current_page--;
        this.changePage(current_page);
    }
  }

  this.nextPage = function () {
    if (current_page < this.numPages()) {
        current_page++;
        this.changePage(current_page);
    }
  }
      
  this.changePage = function (page) {
      var btn_next = document.getElementById("btn_next");
      var btn_prev = document.getElementById("btn_prev");
      var listing_table = document.getElementById("listingTable");
      var page_span = document.getElementById("page");
   
      // Validate page
      if (page < 1) page = 1;
      if (page > this.numPages()) page = this.numPages();

      listing_table.innerHTML = "";

      this.renderDrinks(page);
      page_span.innerHTML = page + "/" + this.numPages();

      if (page == 1) {
          btn_prev.style.visibility = "hidden";
      } else {
          btn_prev.style.visibility = "visible";
      }

      if (page == this.numPages()) {
          btn_next.style.visibility = "hidden";
      } else {
          btn_next.style.visibility = "visible";
      }
  }

  this.numPages = function () {
      return Math.ceil(drinks.length / records_per_page);
  }

  this.changePageSize = function (size) {
      records_per_page = size;
      current_page = 1;
      this.changePage(1);
  }

  this.viewDetails = function (index) {
    document.getElementById("modal-1").checked = true;
    var modalBody = document.getElementById("modal-body");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint_details + index, false);
    xhr.send();
    var details;
    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      try {
        details = JSON.parse(xhr.responseText).drinks[0];
      } catch(exp) {
        console.log('Parse response error', exp);
      }
    }
    if (details) {
    	var content = '<div class="post-container">' +                
    		'<div class="post-thumb"><img class="detail-image" src="' + details.strDrinkThumb + '" /></div>' +
    		'<div class="post-content"><h3 class="post-title">'+ details.strDrink + '</h3>' +
        	'<p>' + details.strInstructions + '</p>' + 
        	'<p> Category: ' + details.strCategory + '</p>' + 
        	'<p>' + details.strAlcoholic + '</p>' + 
        	'<table><thead>' + 
			'<th style="text-align: center;"><strong>Ingredient</strong></th>' +
			'<th style="text-align: center;"><strong>Measure</strong></th>' +  
			'</thead><tbody>';
			for (var i = 1; i < 16; i++) {
				if (details['strIngredient' + i] && details['strIngredient' + i] != '') {
					content += '<tr>' + 
	                    '<td style="text-align: center;">' + details['strIngredient' + i] + '</td>' + 
	                    '<td style="text-align: center;">' + details['strMeasure' + i] + '</td>' +
	                '</tr>';
				}
			}
        	content += '</tbody></table></div></div>';
        	modalBody.innerHTML = content;
    } else {
    	modalBody.innerHTML = 'No response from the server.';
    }
  }
}
app.current_page = 1;


