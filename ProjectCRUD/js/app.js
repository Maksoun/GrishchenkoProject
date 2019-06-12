var app = new function() {
  this.car = {};
  this.cars = [];
  this.filters = [];
  this.allCars = [];
  this.current_page = 1;
  this.records_per_page = 5;

  //guaranties that the car Id will be unique (even in local storage)
  this.unique_car_id = 0;

  this.el = document.getElementById('allCars');
  this.count = function(data) {
    var el   = document.getElementById('counter');
    var name = 'автомобиль.';
    if (data) {
      if (data > 1) {
        name = 'авто.';
      }
      el.innerHTML = 'В наличии ' + data + ' ' + name ;
    } else {
      el.innerHTML = 'В каталоге нет автомобилей.';
    }
  };
  this.modalAction = function (modalAction, index) {
    document.getElementById("modal-1").checked = true;
    var action = modalAction === 'edit' ? 'edit' : 'new';
    var modalBody = document.getElementById("modal-body");
    this.car = action === 'new' ? {
      image_url : '',
      brand : '',
      model : '',
      year : 0,
      gear : 'автомат',
      engine_type : 'бензин',
      engine_volume : 0.0,
      car_type : 'внедорожник 5 дв.',
      odometer : 0,
      price : 0,
      description : ''
    } : this.cars.find(x => x.id.toString() === index.toString());
    var data = '';
    var selected_value = 'selected="selected"';
    var manual_gear = this.car.gear === 'механика' ? selected_value : '';
    var auto_gear = this.car.gear === 'автомат' ? selected_value : '';
    var petrol_fuel = this.car.engine_type === 'бензин' ? selected_value : '';
    var diesel_fuel = this.car.engine_type === 'дизель' ? selected_value : '';

    var jeep_size = this.car.car_type === 'внедорожник 5 дв.' ? selected_value : '';
    var mini_jeep_size = this.car.car_type === 'хэтчбек 5 дв.' ? selected_value : '';
    var van_size = this.car.car_type === 'минивэн' ? selected_value : '';
    var city_car_size = this.car.car_type === 'седан' ? selected_value : '';

    data += action === 'edit' ? '<h2 id="modal-header" align="center">Редактировать объявление</h2>' : 
    '<h2 id="modal-header" align="center">Подать новое объявление</h2>';
    data += '<div class="form-style-5"><form><fieldset><legend><span class="number">1</span>Основная информация</legend>';
    data += '<label for="brand">Марка</label><input type="text" name="brand" placeholder="Марка" value="' + this.car.brand + '" id="brand_input">';
    data += ' <label for="model">Модель</label><input type="email" name="model" placeholder="Модель" value="' + this.car.model + '" id="model_input">';

    data += '<label for="year">Год выпуска</label><input type="number" name="year" placeholder="Год выпуска" value="' + this.car.year + '" id="year_input">';
    data += '<label for="odometer">Пробег</label><input type="number" name="odometer" placeholder="Пробег" value="' + this.car.odometer + '" id="odo_input">';
    data += '<label for="gear">Коробка передач</label><select name="gear" id="gear_input">' + 
            '<option value="автомат" ' + auto_gear + '>Автомат</option><option value="механика" ' + manual_gear + '>Механика</option></select>';
    data += '<label for="engine_volume">Объем двигателя</label>' + 
            '<input type="number" name="engine_volume" placeholder="Объем двигателя" value="' + this.car.engine_volume + '" id="engine_volume_input">';
    data += '<label for="fuel">Тип топлива</label><select name="fuel" id="fuel_input">' +
            '<option value="бензин" ' + petrol_fuel + '>Бензин</option><option value="дизель" ' + diesel_fuel + '>Дизель</option></select>';
    data += '<label for="car_type">Тип кузова</label><select  name="car_type" id="car_type_input">' +
            '<option value="внедорожник 5 дв." ' + jeep_size + '>Внедорожник 5 дв.</option><option value="минивэн" ' + van_size + '>Минивэн</option>' +
            '<option value="хэтчбек 5 дв." ' + mini_jeep_size + '>Хэтчбек 5 дв.</option><option value="седан" ' + city_car_size + '>Седан</option></select>';

    data += '<label for="price">Цена(р.)</label><input type="number" name="price" placeholder="Цена" value="' + this.car.price + '" id="price_input">';
    data += '<label for=""car-image">Изображение (ссылка)</label><input name="car-image" type="text" id="image_input" placeholder="Ссылка" value="' + this.car.image_url + '"/><br/>';
    data += '</fieldset><fieldset><legend><span class="number">2</span>Дополнительная информация</legend>' +
              '<textarea name="description" placeholder="Описание" id="description_input">' + this.car.description.replace('<br/>', '\n') + '</textarea>' +
              '</fieldset><input type="button" value="Сохранить" onclick="app.saveData(' + this.car.id + ');"/></form></div>';

    modalBody.innerHTML = data;
  };
  
  this.saveData = function (index) {
    this.car = {
      id : this.car.id == undefined ? this.unique_car_id : this.car.id,
      image_url : document.getElementById('image_input').value,
      brand : document.getElementById('brand_input').value,
      model : document.getElementById('model_input').value,
      year : parseInt(document.getElementById('year_input').value, 10),
      gear : document.getElementById('gear_input').value,
      engine_type : document.getElementById('fuel_input').value,
      engine_volume : document.getElementById('engine_volume_input').value,
      car_type : document.getElementById('car_type_input').value,
      odometer : parseInt(document.getElementById('odo_input').value, 10),
      price : parseInt(document.getElementById('price_input').value, 10),
      description : document.getElementById('description_input').value.replace('\n', '<br/>')
    }
    if (index != undefined) {
      var carIndex = this.cars.findIndex(x => x.id.toString() === index.toString());
      this.allCars[carIndex] = this.car;
    } else {
      this.allCars.push(this.car);
    }
    this.cars = this.allCars;
    //this.fetchAllCars();
    this.current_page = 1;
    this.changePage(1);
    this.globalFilter();
    window.localStorage.setItem('cars', JSON.stringify(this.allCars));
    document.getElementById("modal-1").checked = false;
  }
  this.delete = function (item) {
    var carIndex = this.allCars.findIndex(x => x.id.toString() === item.toString());
    this.allCars.splice(carIndex, 1);
    this.cars = this.allCars;
    this.current_page = 1;
    this.changePage(1);
    window.localStorage.setItem('cars', JSON.stringify(this.allCars));
  };

  this.globalFilter = function (filter, value) {
    for (var index in this.filters) {
      Object.keys(this.filters[index]).forEach(key => {
        if (filter === key.toString()) {
          this.filters.splice(index, 1);
        }
      });
    }
    switch (filter) {
      case 'car_type': 
        if (value != '*') {
          this.filters.push({ car_type : value });
        }
        break;
      case 'engine_type': 
        if (value != '*') {
          this.filters.push({ engine_type : value });
        }
        break;
      case 'price': 
        if (value != '*') {
          this.filters.push({ price : value });
        }
        break;
      case 'year': 
        if (value != '*') {
          this.filters.push({ year : value });
        }
        break;
      case 'engine_volume': 
        if (value != '*') {
          this.filters.push({ engine_volume : value });
        }
        break;
      case 'global_search': 
        if (value != '') {
          this.filters.push({ global_search : value });
        }
        break;
    }
    this.cars = this.allCars;
    var filters = this.filters;
    for (var index in filters) {
      Object.keys(filters[index]).forEach(key => {
        if (key.toString() === 'car_type' || key.toString() === 'engine_type' || key.toString() === 'year') {
          this.cars = this.cars.filter(function(obj) {
            return (obj[key.toString()].toString() === filters[index][key.toString()]);
          });
        }
        if (key.toString() === 'price') {
          this.cars = this.cars.filter(function(obj) {
            return (filters[index]['price'].includes('<') ? 
              obj['price'] <= filters[index]['price'].replace('<', '') : obj['price'] >= filters[index]['price'].replace('>', ''));
          });
        }
        if (key.toString() === 'engine_volume') {
          this.cars = this.cars.filter(function(obj) {
            return (filters[index]['engine_volume'].includes('<') ? 
              obj['engine_volume'] < filters[index]['engine_volume'].replace('<', '') : filters[index]['engine_volume'].includes('-') ?
              obj['engine_volume'] >= filters[index]['engine_volume'].split('-')[0] && obj['engine_volume'] <= filters[index]['engine_volume'].split('-')[1] : 
              filters[index]['engine_volume'].includes('>') ? obj['engine_volume'] > filters[index]['engine_volume'].replace('>', '') :
              obj['engine_volume'] == filters[index]['engine_volume']);
          });
        }
        if (key.toString() === 'global_search') {
           this.cars = this.cars.filter(function(obj) {
            return Object.keys(obj).some(function(key) {
              return obj[key].toString().toLowerCase().includes(filters[index]['global_search'].toLowerCase());
            });
          });
        }
      });
    }
    this.current_page = 1;
    this.changePage(1);
  }

  this.prevPage = function () {
    if (this.current_page > 1) {
        this.current_page--;
        this.changePage(this.current_page);
    }
  }

  this.nextPage = function () {
      if (this.current_page < this.numPages()) {
          this.current_page++;
          this.changePage(this.current_page);
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

      this.fetchAllCars(page);
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
      return Math.ceil(this.cars.length / this.records_per_page);
  }

  this.changePageSize = function (size) {
      this.records_per_page = size;
      this.changePage(1);
  }

  this.fetchAllCars = function(page) {
    var data = '';
    if (!page) page = 1;
    if (this.cars.length > 0) {
      for (var i = (page-1) * this.records_per_page; i < (page * this.records_per_page) && i < this.cars.length; i++) {
        data += '<div class="listing-item listing-item-firm"><div class="listing-item-image"><div class="listing-item-image-in">';
        data += '<img src="' + this.cars[i].image_url + '" alt="" width="210" height="150" data-object-fit="cover"></div></div>';
        data += '<div class="listing-item-body"><div class="listing-item-wrap"><div class="listing-item-main"><div class="listing-item-title">';
        data += '<h4>' + this.cars[i].brand + ' ' + this.cars[i].model + '</h4></div>';
        data += '<div class="listing-item-desc"><span>';
        data += this.cars[i].year + ', ' + this.cars[i].gear + ', ' + this.cars[i].engine_volume + ' л., ' + this.cars[i].engine_type + ', ' +
                    this.cars[i].car_type + ', ' + this.cars[i].odometer + ' км' + '</span><br/>';

        data += '<strong>' + formatPrice(this.cars[i].price) + 'р.</strong></div>';
        data += '<br/><div class="listing-item-side"><div class="listing-item-bookmark">';
        data += '<button class="action-btn" onclick="app.modalAction(' + '\'edit\', ' + this.cars[i].id + ')">' +
                  '<img src="image/edit1.png" alt="" width="15" height="15" data-object-fit="cover"></button>';
        data += '<button class="action-btn" onclick="app.delete(' + this.cars[i].id + ')">' + 
                  '<img src="image/trash1.png" alt="" width="15" height="15" data-object-fit="cover"></div></div></button>';
        data += '<div class="listing-item-message"><div class="listing-item-message-in">';
        data += this.cars[i].description + '</div></div>';
        data += '</div></div></div></div>';
      }
    }
    this.count(this.cars.length);
    return this.el.innerHTML = data;
  };
}
app.cars = initData();
app.allCars = app.cars;
app.changePage(1);

//guaranties that the car Id will be unique (even in local storage)
for (var car in app.allCars) {
  if (app.allCars[car].id > app.unique_car_id) {
    app.unique_car_id = app.allCars[car].id;
  }
}
app.unique_car_id++;

function formatPrice(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

function initData() {
  if (window.localStorage.getItem('cars')) {
    return JSON.parse(window.localStorage.getItem('cars'));
  } else {
    return [
        {
          id : 1,
          image_url : 'https://static.av.by/public_images/big/015/60/87/public_15608732_b_a617fdf.jpeg',
          brand : 'Land Rover',
          model : 'Range Rover Velar P300 R Dynamic',
          year : 2018,
          gear : 'автомат',
          engine_type : 'бензин',
          engine_volume : '2.0',
          car_type : 'внедорожник 5 дв.',
          odometer : 23411,
          price : 152590,
          description : '300 л.с., один владелец, сервисная книга, идеальное состояние.Независимая пневмоподвеска 4-х колес. <br/> Автомобиль был куплен и обслуживался у официального дилера Land Rover в Минске. Полностью соответствует требованиям Land Rover Approved.'
        },
        {
          id : 2,
          image_url : 'https://static.av.by/public_images/preview/015/53/33/public_15533344_s_942a8e8.jpeg',
          brand : 'Land Rover',
          model : 'Range Rover Sport II SVR',
          year : 2015,
          gear : 'автомат',
          engine_type : 'бензин',
          engine_volume : '5.0',
          car_type : 'внедорожник 5 дв.',
          odometer : 75910,
          price : 146923,
          description : 'Автомобиль прошел комплексную диагностику. <br/>Каждый автомобиль Автоцентра «Атлант-М Британия» проходит тщательный отбор.'
        },
        {
          id : 3,
          image_url : 'https://static.av.by/public_images/preview/014/79/71/public_14797125_s_f962de8.jpeg',
          brand : 'Peugeot',
          model : 'Expert II (рестайлинг) TepeeLong',
          year : 2014,
          gear : 'механика',
          engine_type : 'дизель',
          engine_volume : '1.6',
          car_type : 'минивэн',
          odometer : 167870,
          price : 13490,
          description : 'Автомобиль находится на площадке автоцентра Атлант-М Боровая. Цена с НДС 20%. Приобретался у официального дилера новым в РФ. 8+1.'
        },
        {
          id : 4,
          image_url : 'https://static.av.by/public_images/preview/014/29/26/public_14292656_s_8ff2bee.jpeg',
          brand : 'Peugeot',
          model : '5008 I (рестайлинг)',
          year : 2014,
          gear : 'автомат',
          engine_type : 'дизель',
          engine_volume : '1.6',
          car_type : 'минивэн',
          odometer : 198000,
          price : 13800,
          description : 'Машина из Бельгии. 1.5 года в Белоруси,выгонял сам. Самая полная комплектация!!!!!'
        },
        {
          id : 5,
          image_url : 'https://static.av.by/public_images/preview/014/79/57/public_14795757_s_d5bb83f.jpeg',
          brand : 'BMW',
          model : 'X6 F16 30d xDrive',
          year : 2016,
          gear : 'автомат',
          engine_type : 'дизель',
          engine_volume : '3.0',
          car_type : 'внедорожник 5 дв.',
          odometer : 92291,
          price : 52800,
          description : 'Оригинальный пробег. Предоставим отчет диагностики официального дилера BMW в РБ. Возможна продажа в кредит.'
        },
        {
          id : 6,
          image_url : 'https://static.av.by/public_images/preview/014/64/97/public_14649727_s_82f5ebb.jpeg',
          brand : 'BMW',
          model : 'i3 I01 Giga',
          year : 2015,
          gear : 'автомат',
          engine_type : 'бензин',
          engine_volume : '0.6',
          car_type : 'хэтчбек 5 дв.',
          odometer : 38000,
          price : 28000,
          description : 'Автомобиль из США. Чистый CARFAX.'
        },
        {
          id : 7,
          image_url : 'https://static.av.by/public_images/preview/015/60/12/public_15601270_s_51f2568.jpeg',
          brand : 'BMW',
          model : '5 серия E34',
          year : 1998,
          gear : 'механика',
          engine_type : 'бензин',
          engine_volume : '2.0',
          car_type : 'седан',
          odometer : 200000,
          price : 52800,
          description : 'Оригинальный пробег. Предоставим отчет диагностики официального дилера BMW в РБ. Возможна продажа в кредит.'
        }
    ];
  }
}